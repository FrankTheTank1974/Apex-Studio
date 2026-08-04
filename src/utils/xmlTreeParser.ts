/**
 * XML Tree Parser Utility
 * Converts raw XML string into a structured tree model with line numbers,
 * character offsets, attributes, child nodes, and text previews for the
 * XML Structure Explorer tree view.
 */

export interface XmlTreeNode {
  id: string;
  tagName: string;
  startOffset: number;
  endOffset?: number;
  line: number;
  attributes: Record<string, string>;
  textPreview?: string;
  children: XmlTreeNode[];
  depth: number;
}

export interface XmlTreeParseResult {
  success: boolean;
  rootNode: XmlTreeNode | null;
  error?: string;
  totalNodes: number;
}

export function parseXmlToTree(xmlContent: string): XmlTreeParseResult {
  if (!xmlContent || !xmlContent.trim()) {
    return { success: true, rootNode: null, totalNodes: 0 };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');

    const parserErrors = doc.getElementsByTagName('parsererror');
    if (parserErrors.length > 0) {
      return {
        success: false,
        rootNode: null,
        error: parserErrors[0].textContent?.split('\n')[0] || 'XML parsing error',
        totalNodes: 0
      };
    }

    const rootEl = doc.documentElement;
    if (!rootEl) {
      return { success: true, rootNode: null, totalNodes: 0 };
    }

    const xmlLines = xmlContent.split('\n');
    let totalNodesCount = 0;

    function buildNode(el: Element, depth: number = 0, startSearchLine: number = 1): XmlTreeNode {
      totalNodesCount++;
      const tagName = el.nodeName;

      // Extract attributes
      const attributes: Record<string, string> = {};
      if (el.attributes) {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attributes[attr.name] = attr.value;
        }
      }

      // Calculate approximate line and offset
      const line = findTagLineInXml(xmlLines, tagName, startSearchLine);
      const startOffset = calculateOffsetFromLine(xmlLines, line, tagName);

      // Extract text content preview if no element children
      let textPreview: string | undefined = undefined;
      const childElements = Array.from(el.children);
      if (childElements.length === 0) {
        const txt = el.textContent?.trim();
        if (txt) {
          textPreview = txt.length > 30 ? `${txt.substring(0, 30)}…` : txt;
        }
      }

      const children = childElements.map((child, index) =>
        buildNode(child, depth + 1, Math.max(1, line))
      );

      return {
        id: `xml-node-${tagName}-${line}-${startOffset}-${Math.random().toString(36).substring(2, 7)}`,
        tagName,
        startOffset,
        line,
        attributes,
        textPreview,
        children,
        depth
      };
    }

    const rootNode = buildNode(rootEl, 0, 1);

    return {
      success: true,
      rootNode,
      totalNodes: totalNodesCount
    };
  } catch (err: any) {
    return {
      success: false,
      rootNode: null,
      error: err?.message || 'Failed to parse XML tree',
      totalNodes: 0
    };
  }
}

function findTagLineInXml(lines: string[], tagName: string, startFromLine: number = 1): number {
  const pattern = new RegExp(`<${tagName}(\\s|>|/)`, 'i');
  for (let i = Math.max(0, startFromLine - 1); i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  for (let i = 0; i < Math.max(0, startFromLine - 1); i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return startFromLine;
}

function calculateOffsetFromLine(lines: string[], lineNum: number, tagName: string): number {
  let offset = 0;
  const targetLineIdx = Math.max(0, lineNum - 1);

  for (let i = 0; i < targetLineIdx && i < lines.length; i++) {
    offset += lines[i].length + 1; // +1 for newline
  }

  const targetLine = lines[targetLineIdx] || '';
  const matchIdx = targetLine.search(new RegExp(`<${tagName}(\\s|>|/)`, 'i'));
  if (matchIdx !== -1) {
    offset += matchIdx;
  }

  return offset;
}
