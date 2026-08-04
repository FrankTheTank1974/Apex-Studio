/**
 * XML to JSON Conversion Engine
 * Parses raw XML text into a structured JSON representation using DOMParser.
 * Captures attributes (@_attr), child elements, arrays for repeating tags,
 * and text nodes.
 */

export interface XmlToJsonResult {
  success: boolean;
  jsonString?: string;
  jsonObject?: Record<string, any>;
  error?: string;
}

export function convertXmlToJson(xmlString: string): XmlToJsonResult {
  if (!xmlString || !xmlString.trim()) {
    return { success: false, error: 'XML content is empty.' };
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for XML parsing errors from DOMParser
    const parseErrors = xmlDoc.getElementsByTagName('parsererror');
    if (parseErrors.length > 0) {
      const errorMsg = parseErrors[0].textContent || 'Invalid XML markup';
      return {
        success: false,
        error: `XML Parse Error: ${errorMsg.replace(/This page contains the following errors:[\s\S]*/, '').trim()}`
      };
    }

    const rootElement = xmlDoc.documentElement;
    if (!rootElement) {
      return { success: false, error: 'No root element found in XML.' };
    }

    const resultObj: Record<string, any> = {
      [rootElement.nodeName]: domNodeToJson(rootElement)
    };

    return {
      success: true,
      jsonString: JSON.stringify(resultObj, null, 2),
      jsonObject: resultObj
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to convert XML to JSON.'
    };
  }
}

function domNodeToJson(node: Element): any {
  const obj: Record<string, any> = {};

  // 1. Process Attributes
  if (node.attributes && node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      obj[`@_${attr.name}`] = parseValue(attr.value);
    }
  }

  // 2. Process Child Nodes
  const childElements: Element[] = [];
  let textContent = '';

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      childElements.push(child as Element);
    } else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
      const text = child.textContent?.trim() || '';
      if (text) {
        textContent += (textContent ? ' ' : '') + text;
      }
    }
  }

  // 3. Handle Child Elements
  if (childElements.length > 0) {
    const childrenMap: Record<string, any[]> = {};

    childElements.forEach((childEl) => {
      const tagName = childEl.nodeName;
      if (!childrenMap[tagName]) {
        childrenMap[tagName] = [];
      }
      childrenMap[tagName].push(domNodeToJson(childEl));
    });

    Object.keys(childrenMap).forEach((tagName) => {
      const list = childrenMap[tagName];
      if (list.length === 1) {
        obj[tagName] = list[0];
      } else {
        obj[tagName] = list;
      }
    });

    if (textContent) {
      obj['#text'] = parseValue(textContent);
    }
  } else {
    // Leaf node
    if (Object.keys(obj).length === 0) {
      return parseValue(textContent);
    } else if (textContent) {
      obj['#text'] = parseValue(textContent);
    }
  }

  return obj;
}

function parseValue(val: string): any {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null') return null;
  if (!isNaN(Number(val)) && val.trim() !== '') {
    return Number(val);
  }
  return val;
}
