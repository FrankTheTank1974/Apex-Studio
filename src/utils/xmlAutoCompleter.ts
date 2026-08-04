/**
 * XML Auto-Completion & Tag Suggestion Engine
 * Analyzes document structure, extracts tag hierarchy and tag names,
 * detects open tags at cursor position, and provides contextual completions.
 */

export interface XmlTagSuggestion {
  label: string;          // e.g., "<metadata>" or "</metadata>" or "<feature name=\"\" />"
  insertText: string;     // Text to insert at cursor position
  type: 'opening' | 'paired' | 'closing' | 'self-closing';
  tagName: string;
  detail?: string;        // Human-readable description
  cursorOffsetIndex?: number; // Relative position to place cursor after insertion
}

export function extractDocumentXmlTags(content: string): string[] {
  if (!content) return [];
  const tagNames = new Set<string>();
  const tagRegex = /<\/?([a-zA-Z0-9_\-:]+)(?:\s+[^>]*)?>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(content)) !== null) {
    const name = match[1];
    if (name && !name.startsWith('?') && !name.startsWith('!')) {
      tagNames.add(name);
    }
  }

  return Array.from(tagNames);
}

export interface XmlBreadcrumbNode {
  tagName: string;
  startOffset: number;
}

/**
 * Determines open parent tags and their start positions at cursor offset
 * for breadcrumb navigation bar rendering.
 */
export function getXmlBreadcrumbsAtCursor(content: string, cursorOffset: number): XmlBreadcrumbNode[] {
  if (!content) return [];
  const codeUpToCursor = content.substring(0, cursorOffset);
  const tagRegex = /<(\/)?([a-zA-Z0-9_\-:]+)(?:\s+[^>]*?)?(\/)?>/g;
  const stack: XmlBreadcrumbNode[] = [];

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(codeUpToCursor)) !== null) {
    const isClosing = Boolean(match[1]);
    const tagName = match[2];
    const isSelfClosing = Boolean(match[3]);
    const matchIndex = match.index;

    if (tagName.startsWith('?') || tagName.startsWith('!')) continue;

    if (!isClosing && !isSelfClosing) {
      stack.push({
        tagName,
        startOffset: matchIndex,
      });
    } else if (isClosing) {
      if (stack.length > 0 && stack[stack.length - 1].tagName === tagName) {
        stack.pop();
      }
    }
  }

  return stack;
}

/**
 * Determines open tags at cursor position to suggest closing tag
 */
export function getOpenParentTagsAtCursor(content: string, cursorOffset: number): string[] {
  return getXmlBreadcrumbsAtCursor(content, cursorOffset).map((b) => b.tagName);
}

/**
 * Gets active completion context and suggestions based on text around cursor
 */
export function getXmlCompletionsAtCursor(
  content: string,
  cursorOffset: number,
  additionalXmlFilesContent: string[] = []
): {
  query: string;
  prefixStart: number;
  suggestions: XmlTagSuggestion[];
} {
  // Extract all tag names from current document and other XML files
  const documentTags = new Set<string>(extractDocumentXmlTags(content));
  additionalXmlFilesContent.forEach((xmlText) => {
    extractDocumentXmlTags(xmlText).forEach((t) => documentTags.add(t));
  });

  const openTags = getOpenParentTagsAtCursor(content, cursorOffset);
  const currentParent = openTags.length > 0 ? openTags[openTags.length - 1] : null;

  const textBeforeCursor = content.substring(0, cursorOffset);
  
  // Find if user is typing a tag starting with '<'
  const lastLtIndex = textBeforeCursor.lastIndexOf('<');
  const lastGtIndex = textBeforeCursor.lastIndexOf('>');

  let query = '';
  let prefixStart = cursorOffset;

  if (lastLtIndex !== -1 && lastLtIndex > lastGtIndex) {
    // User is currently inside an unclosed `<...` tag
    query = textBeforeCursor.substring(lastLtIndex); // e.g. "<meta" or "</meta" or "<"
    prefixStart = lastLtIndex;
  }

  const suggestions: XmlTagSuggestion[] = [];

  if (query.startsWith('</')) {
    // Closing Tag completions
    const typedPrefix = query.substring(2).toLowerCase();

    // 1. Immediate priority: Current parent closing tag
    if (currentParent && currentParent.toLowerCase().startsWith(typedPrefix)) {
      suggestions.push({
        label: `</${currentParent}>`,
        insertText: `</${currentParent}>`,
        type: 'closing',
        tagName: currentParent,
        detail: `Close parent element <${currentParent}>`
      });
    }

    // 2. All other document tags for closing
    documentTags.forEach((tag) => {
      if (tag !== currentParent && tag.toLowerCase().startsWith(typedPrefix)) {
        suggestions.push({
          label: `</${tag}>`,
          insertText: `</${tag}>`,
          type: 'closing',
          tagName: tag,
          detail: `Close <${tag}> tag`
        });
      }
    });

  } else if (query.startsWith('<')) {
    // Opening / Paired / Self-closing completions
    const typedPrefix = query.substring(1).toLowerCase();

    // 1. If parent tag exists, suggest matching closing tag first
    if (currentParent && `/${currentParent}`.toLowerCase().startsWith(typedPrefix)) {
      suggestions.push({
        label: `</${currentParent}>`,
        insertText: `</${currentParent}>`,
        type: 'closing',
        tagName: currentParent,
        detail: `Close parent <${currentParent}>`
      });
    }

    // 2. Suggest paired tags <tag></tag> for known document tags
    documentTags.forEach((tag) => {
      if (tag.toLowerCase().startsWith(typedPrefix)) {
        suggestions.push({
          label: `<${tag}> ... </${tag}>`,
          insertText: `<${tag}></${tag}>`,
          type: 'paired',
          tagName: tag,
          detail: `Insert paired <${tag}> element`,
          cursorOffsetIndex: tag.length + 2 // Cursor placed inside <tag>| </tag>
        });

        suggestions.push({
          label: `<${tag} />`,
          insertText: `<${tag} />`,
          type: 'self-closing',
          tagName: tag,
          detail: `Self-closing <${tag} /> element`
        });
      }
    });
  } else {
    // General suggestions when cursor is anywhere in document
    if (currentParent) {
      suggestions.push({
        label: `</${currentParent}>`,
        insertText: `</${currentParent}>`,
        type: 'closing',
        tagName: currentParent,
        detail: `Close open parent <${currentParent}>`
      });
    }

    documentTags.forEach((tag) => {
      suggestions.push({
        label: `<${tag}> ... </${tag}>`,
        insertText: `<${tag}></${tag}>`,
        type: 'paired',
        tagName: tag,
        detail: `Paired <${tag}> element`,
        cursorOffsetIndex: tag.length + 2
      });
    });
  }

  // Deduplicate and filter suggestions
  const uniqueSuggestionsMap = new Map<string, XmlTagSuggestion>();
  suggestions.forEach((s) => {
    if (!uniqueSuggestionsMap.has(s.label)) {
      uniqueSuggestionsMap.set(s.label, s);
    }
  });

  return {
    query,
    prefixStart,
    suggestions: Array.from(uniqueSuggestionsMap.values()).slice(0, 10)
  };
}
