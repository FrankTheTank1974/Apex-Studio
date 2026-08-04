/**
 * W3C XML Schema (XSD) Validation Engine
 * Parses XSD XML schema definitions and validates XML documents against them.
 * Provides line-by-line diagnostic error reports and automatic XSD schema generation.
 */

export interface XsdValidationError {
  id: string;
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
  elementName?: string;
  rule: 'xsd-root-mismatch' | 'xsd-unknown-element' | 'xsd-missing-attribute' | 'xsd-invalid-attribute' | 'xsd-type-mismatch' | 'xsd-cardinality-violation' | 'xsd-enum-violation' | 'xsd-schema-syntax';
  offendingText?: string;
  expectedText?: string;
  suggestion?: string;
}

export interface XsdValidationResult {
  valid: boolean;
  errors: XsdValidationError[];
  schemaRootElements: string[];
  targetNamespace?: string;
}

interface XsdElementDef {
  name: string;
  type?: string;
  minOccurs?: number;
  maxOccurs?: number | 'unbounded';
  requiredAttributes?: string[];
  allowedAttributes?: string[];
  allowedChildren?: string[];
  enums?: string[];
  isComplex?: boolean;
}

/**
 * Validates XML document content against an XSD schema text
 */
export function validateXmlAgainstXsd(xmlContent: string, xsdContent: string): XsdValidationResult {
  const errors: XsdValidationError[] = [];
  if (!xmlContent || !xmlContent.trim()) {
    return { valid: true, errors: [], schemaRootElements: [] };
  }

  if (!xsdContent || !xsdContent.trim()) {
    return {
      valid: false,
      errors: [{
        id: 'xsd-empty-schema',
        line: 1,
        message: 'XSD Schema is empty. Please provide a valid XML Schema Definition.',
        severity: 'error',
        rule: 'xsd-schema-syntax'
      }],
      schemaRootElements: []
    };
  }

  const parser = new DOMParser();

  // 1. Parse XSD Schema
  let xsdDoc: Document;
  try {
    xsdDoc = parser.parseFromString(xsdContent, 'text/xml');
    const xsdErrors = xsdDoc.getElementsByTagName('parsererror');
    if (xsdErrors.length > 0) {
      return {
        valid: false,
        errors: [{
          id: 'xsd-parse-err',
          line: 1,
          message: `Invalid XSD Schema syntax: ${xsdErrors[0].textContent?.split('\n')[0] || 'XML parse error'}`,
          severity: 'error',
          rule: 'xsd-schema-syntax'
        }],
        schemaRootElements: []
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      errors: [{
        id: 'xsd-parse-err-ex',
        line: 1,
        message: `Failed to parse XSD Schema: ${err?.message || 'Syntax error'}`,
        severity: 'error',
        rule: 'xsd-schema-syntax'
      }],
      schemaRootElements: []
    };
  }

  // 2. Parse XML Document
  let xmlDoc: Document;
  try {
    xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    const xmlErrors = xmlDoc.getElementsByTagName('parsererror');
    if (xmlErrors.length > 0) {
      return {
        valid: false,
        errors: [{
          id: 'xml-parse-err',
          line: 1,
          message: `XML Document contains syntax errors. Fix XML markup before XSD validation.`,
          severity: 'error',
          rule: 'xsd-schema-syntax'
        }],
        schemaRootElements: []
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      errors: [{
        id: 'xml-parse-err-ex',
        line: 1,
        message: `Failed to parse XML document: ${err?.message}`,
        severity: 'error',
        rule: 'xsd-schema-syntax'
      }],
      schemaRootElements: []
    };
  }

  // Extract Top-Level Elements & Target Namespace from XSD
  const schemaEl = xsdDoc.documentElement;
  const targetNamespace = schemaEl.getAttribute('targetNamespace') || undefined;

  const elementDefsMap = parseXsdElementDefinitions(xsdDoc);
  const rootElements = Array.from(elementDefsMap.keys());

  const xmlLines = xmlContent.split('\n');

  const xmlRoot = xmlDoc.documentElement;
  if (!xmlRoot) {
    return { valid: true, errors: [], schemaRootElements: rootElements, targetNamespace };
  }

  const rootName = xmlRoot.nodeName;
  const rootLine = findElementLineInXml(xmlLines, rootName, 1);

  // Check 1: Root Element
  if (rootElements.length > 0 && !rootElements.includes(rootName)) {
    const expectedRoot = rootElements[0];
    errors.push({
      id: `err-root-${rootName}`,
      line: rootLine,
      message: `Root element <${rootName}> is not declared in XSD schema. Expected root element: ${rootElements.map(e => `<${e}>`).join(' or ')}`,
      severity: 'error',
      elementName: rootName,
      rule: 'xsd-root-mismatch',
      offendingText: rootName,
      expectedText: expectedRoot,
      suggestion: `Rename root element <${rootName}> to <${expectedRoot}>`
    });
  }

  // Recursively validate XML nodes
  validateXmlNode(xmlRoot, elementDefsMap, xmlLines, errors);

  return {
    valid: errors.length === 0,
    errors,
    schemaRootElements: rootElements,
    targetNamespace
  };
}

/**
 * Parses XSD Schema DOM to extract element rules, attribute constraints, and data types
 */
function parseXsdElementDefinitions(xsdDoc: Document): Map<string, XsdElementDef> {
  const map = new Map<string, XsdElementDef>();

  // Helper to query element by local name ignoring xs: or xsd: prefix
  const getXsdNodes = (parent: Element | Document, localName: string) => {
    const list: Element[] = [];
    const all = parent.getElementsByTagName('*');
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      const name = el.localName || el.nodeName.replace(/^[^:]+:/, '');
      if (name.toLowerCase() === localName.toLowerCase()) {
        list.push(el);
      }
    }
    return list;
  };

  // Process top-level and nested element declarations
  const elementNodes = getXsdNodes(xsdDoc, 'element');

  elementNodes.forEach((el) => {
    const name = el.getAttribute('name');
    if (!name) return;

    const typeAttr = el.getAttribute('type');
    const minOccursAttr = el.getAttribute('minOccurs');
    const maxOccursAttr = el.getAttribute('maxOccurs');

    const minOccurs = minOccursAttr ? parseInt(minOccursAttr, 10) : 1;
    let maxOccurs: number | 'unbounded' = 1;
    if (maxOccursAttr === 'unbounded') {
      maxOccurs = 'unbounded';
    } else if (maxOccursAttr) {
      maxOccurs = parseInt(maxOccursAttr, 10);
    }

    const requiredAttributes: string[] = [];
    const allowedAttributes: string[] = [];
    const allowedChildren: string[] = [];
    const enums: string[] = [];

    // Check child attributes inside this element or its complexType
    const attrNodes = getXsdNodes(el, 'attribute');
    attrNodes.forEach((attrEl) => {
      const attrName = attrEl.getAttribute('name');
      const use = attrEl.getAttribute('use');
      if (attrName) {
        allowedAttributes.push(attrName);
        if (use === 'required') {
          requiredAttributes.push(attrName);
        }
      }
    });

    // Check child element declarations under sequence / choice / all
    const childElemNodes = getXsdNodes(el, 'element');
    childElemNodes.forEach((childEl) => {
      const childName = childEl.getAttribute('name');
      if (childName && childName !== name) {
        allowedChildren.push(childName);
      }
    });

    // Check enumerations
    const enumNodes = getXsdNodes(el, 'enumeration');
    enumNodes.forEach((enumEl) => {
      const val = enumEl.getAttribute('value');
      if (val) enums.push(val);
    });

    map.set(name, {
      name,
      type: typeAttr || undefined,
      minOccurs,
      maxOccurs,
      requiredAttributes,
      allowedAttributes,
      allowedChildren,
      enums,
      isComplex: allowedChildren.length > 0 || allowedAttributes.length > 0
    });
  });

  return map;
}

/**
 * Validates a specific XML Element node against XSD definitions
 */
function validateXmlNode(
  node: Element,
  elementDefsMap: Map<string, XsdElementDef>,
  xmlLines: string[],
  errors: XsdValidationError[],
  startLineSearch: number = 1
) {
  const name = node.nodeName;
  const line = findElementLineInXml(xmlLines, name, startLineSearch);

  const def = elementDefsMap.get(name);

  if (def) {
    // 1. Required Attributes Check
    if (def.requiredAttributes && def.requiredAttributes.length > 0) {
      def.requiredAttributes.forEach((reqAttr) => {
        if (!node.hasAttribute(reqAttr)) {
          errors.push({
            id: `err-req-attr-${name}-${reqAttr}-${line}`,
            line,
            message: `Element <${name}> is missing required XSD attribute "${reqAttr}".`,
            severity: 'error',
            elementName: name,
            rule: 'xsd-missing-attribute',
            offendingText: reqAttr,
            suggestion: `Add missing attribute "${reqAttr}" to <${name}>`
          });
        }
      });
    }

    // 2. Allowed Attributes Check
    if (def.allowedAttributes && def.allowedAttributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (!attr.name.startsWith('xmlns') && !def.allowedAttributes.includes(attr.name)) {
          errors.push({
            id: `err-unallowed-attr-${name}-${attr.name}-${line}`,
            line,
            message: `Attribute "${attr.name}" is not declared for element <${name}> in XSD schema. Allowed attributes: ${def.allowedAttributes.join(', ')}`,
            severity: 'warning',
            elementName: name,
            rule: 'xsd-invalid-attribute',
            offendingText: attr.name,
            suggestion: `Remove undeclared attribute "${attr.name}"`
          });
        }
      }
    }

    // 3. Enumeration Value Check
    if (def.enums && def.enums.length > 0) {
      const textVal = node.textContent?.trim() || '';
      if (!def.enums.includes(textVal)) {
        errors.push({
          id: `err-enum-${name}-${line}`,
          line,
          message: `Value "${textVal}" for <${name}> violates XSD enumeration constraint. Allowed values: ${def.enums.map(e => `"${e}"`).join(', ')}`,
          severity: 'error',
          elementName: name,
          rule: 'xsd-enum-violation',
          offendingText: textVal,
          expectedText: def.enums[0],
          suggestion: `Change value of <${name}> to "${def.enums[0]}"`
        });
      }
    }

    // 4. Data Type Validation
    if (def.type) {
      const typeClean = def.type.replace(/^[^:]+:/, '').toLowerCase();
      const textVal = node.textContent?.trim() || '';

      if (textVal) {
        if ((typeClean === 'integer' || typeClean === 'int') && !/^-?\d+$/.test(textVal)) {
          errors.push({
            id: `err-type-int-${name}-${line}`,
            line,
            message: `Element <${name}> value "${textVal}" is not a valid XSD integer.`,
            severity: 'error',
            elementName: name,
            rule: 'xsd-type-mismatch',
            offendingText: textVal,
            expectedText: '0',
            suggestion: `Change value to integer "0"`
          });
        } else if (typeClean === 'boolean' && !/^(true|false|1|0)$/.test(textVal)) {
          errors.push({
            id: `err-type-bool-${name}-${line}`,
            line,
            message: `Element <${name}> value "${textVal}" is not a valid XSD boolean (true/false).`,
            severity: 'error',
            elementName: name,
            rule: 'xsd-type-mismatch',
            offendingText: textVal,
            expectedText: 'true',
            suggestion: `Change value to "true"`
          });
        } else if (typeClean === 'decimal' && !/^-?\d+(\.\d+)?$/.test(textVal)) {
          errors.push({
            id: `err-type-dec-${name}-${line}`,
            line,
            message: `Element <${name}> value "${textVal}" is not a valid XSD decimal.`,
            severity: 'error',
            elementName: name,
            rule: 'xsd-type-mismatch',
            offendingText: textVal,
            expectedText: '0.0',
            suggestion: `Change value to decimal "0.0"`
          });
        }
      }
    }

    // 5. Allowed Children Check & Cardinality
    if (def.allowedChildren && def.allowedChildren.length > 0) {
      const childCounts: Record<string, number> = {};
      const children = Array.from(node.children);

      children.forEach((child) => {
        const childName = child.nodeName;
        childCounts[childName] = (childCounts[childName] || 0) + 1;

        if (!def.allowedChildren?.includes(childName)) {
          const childLine = findElementLineInXml(xmlLines, childName, line);
          errors.push({
            id: `err-unallowed-child-${name}-${childName}-${childLine}`,
            line: childLine,
            message: `Unexpected child element <${childName}> inside <${name}>. Allowed child elements in XSD: ${def.allowedChildren.map(c => `<${c}>`).join(' or ')}`,
            severity: 'error',
            elementName: childName,
            rule: 'xsd-unknown-element',
            offendingText: childName,
            suggestion: `Remove unexpected element <${childName}>`
          });
        }
      });
    }
  }

  // Validate children recursively
  Array.from(node.children).forEach((child) => {
    validateXmlNode(child, elementDefsMap, xmlLines, errors, line);
  });
}

/**
 * Finds approximate 1-based line number in XML lines for a given tag
 */
function findElementLineInXml(lines: string[], tagName: string, startFromLine: number = 1): number {
  const pattern = new RegExp(`<${tagName}(\\s|>|/)`, 'i');
  for (let i = startFromLine - 1; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  // Fallback search from top
  for (let i = 0; i < startFromLine - 1; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return startFromLine;
}

/**
 * Infers an initial W3C XSD Schema from an existing XML document
 */
export function generateXsdFromXml(xmlString: string): string {
  if (!xmlString || !xmlString.trim()) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root" type="xs:string"/>
</xs:schema>`;
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const root = xmlDoc.documentElement;

    if (!root) throw new Error('No root element');

    let xsdBody = '';

    function processElement(el: Element, indentLevel: number = 2): string {
      const indent = ' '.repeat(indentLevel);
      const name = el.nodeName;
      const children = Array.from(el.children);
      const attributes = Array.from(el.attributes);

      if (children.length === 0 && attributes.length === 0) {
        // Simple type element
        const textVal = el.textContent?.trim() || '';
        let type = 'xs:string';
        if (/^-?\d+$/.test(textVal)) type = 'xs:integer';
        else if (/^-?\d+\.\d+$/.test(textVal)) type = 'xs:decimal';
        else if (/^(true|false)$/i.test(textVal)) type = 'xs:boolean';

        return `${indent}<xs:element name="${name}" type="${type}"/>\n`;
      }

      let res = `${indent}<xs:element name="${name}">\n`;
      res += `${indent}  <xs:complexType>\n`;

      if (children.length > 0) {
        res += `${indent}    <xs:sequence>\n`;
        const processedTags = new Set<string>();

        children.forEach((child) => {
          const childName = child.nodeName;
          if (!processedTags.has(childName)) {
            processedTags.add(childName);
            res += processElement(child, indentLevel + 6);
          }
        });

        res += `${indent}    </xs:sequence>\n`;
      }

      if (attributes.length > 0) {
        attributes.forEach((attr) => {
          if (!attr.name.startsWith('xmlns')) {
            res += `${indent}    <xs:attribute name="${attr.name}" type="xs:string" use="optional"/>\n`;
          }
        });
      }

      res += `${indent}  </xs:complexType>\n`;
      res += `${indent}</xs:element>\n`;
      return res;
    }

    xsdBody = processElement(root, 2);

    return `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
${xsdBody}</xs:schema>`;

  } catch (err) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <!-- Auto-generation fallback -->
  <xs:element name="root" type="xs:string"/>
</xs:schema>`;
  }
}
