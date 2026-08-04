/**
 * Real-time XML Linter Engine
 * Validates XML structure, well-formedness, tag case-sensitive matching,
 * unclosed CDATA/comments/processing instructions, duplicate attributes,
 * unclosed attribute quotes, and multi-root violations.
 */

export interface XmlLintIssue {
  id: string;
  line: number;        // 1-based line number
  column?: number;     // 1-based column offset
  message: string;     // Human readable description
  severity: 'error' | 'warning' | 'info';
  rule: 
    | 'unclosed-comment'
    | 'unclosed-cdata'
    | 'unclosed-pi'
    | 'unclosed-tag'
    | 'unmatched-closing-tag'
    | 'unclosed-quote'
    | 'duplicate-attribute'
    | 'invalid-tag-name'
    | 'missing-xml-declaration'
    | 'multiple-root-elements';
  suggestion?: string;
  offendingText?: string;
  tagName?: string;
}

export function lintXml(content: string): XmlLintIssue[] {
  const issues: XmlLintIssue[] = [];
  if (!content || !content.trim()) return issues;

  const lines = content.split('\n');

  // 1. Processing Instructions & Comments & CDATA state tracking across lines
  let inComment = false;
  let commentStartLine = 1;
  let inCdata = false;
  let cdataStartLine = 1;
  let inPi = false;
  let piStartLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    // Check XML Comments <!-- ... -->
    if (!inComment && line.includes('<!--')) {
      const startIdx = line.indexOf('<!--');
      const endIdx = line.indexOf('-->', startIdx + 4);
      if (endIdx === -1) {
        inComment = true;
        commentStartLine = lineNum;
      }
    } else if (inComment) {
      if (line.includes('-->')) {
        inComment = false;
      }
    }

    // Check CDATA <![CDATA[ ... ]]>
    if (!inCdata && line.includes('<![CDATA[')) {
      const startIdx = line.indexOf('<![CDATA[');
      const endIdx = line.indexOf(']]>', startIdx + 9);
      if (endIdx === -1) {
        inCdata = true;
        cdataStartLine = lineNum;
      }
    } else if (inCdata) {
      if (line.includes(']]>')) {
        inCdata = false;
      }
    }

    // Check Processing Instruction <?xml ... ?>
    if (!inPi && line.includes('<?')) {
      const startIdx = line.indexOf('<?');
      const endIdx = line.indexOf('?>', startIdx + 2);
      if (endIdx === -1) {
        inPi = true;
        piStartLine = lineNum;
      }
    } else if (inPi) {
      if (line.includes('?>')) {
        inPi = false;
      }
    }
  }

  if (inComment) {
    issues.push({
      id: `xml-unclosed-comment-${commentStartLine}`,
      line: commentStartLine,
      message: 'Unclosed XML comment. Missing closing "-->".',
      severity: 'error',
      rule: 'unclosed-comment',
      suggestion: 'Add "-->" to close comment'
    });
  }

  if (inCdata) {
    issues.push({
      id: `xml-unclosed-cdata-${cdataStartLine}`,
      line: cdataStartLine,
      message: 'Unclosed CDATA block. Missing closing "]]>".',
      severity: 'error',
      rule: 'unclosed-cdata',
      suggestion: 'Add "]]>" to close CDATA section'
    });
  }

  if (inPi) {
    issues.push({
      id: `xml-unclosed-pi-${piStartLine}`,
      line: piStartLine,
      message: 'Unclosed XML Processing Instruction. Missing "?>".',
      severity: 'error',
      rule: 'unclosed-pi',
      suggestion: 'Add "?>" to close processing instruction'
    });
  }

  // 2. XML Declaration Check (Informational/Warning)
  const trimmedFirst = content.trimStart();
  if (!trimmedFirst.startsWith('<?xml')) {
    issues.push({
      id: 'xml-missing-decl-1',
      line: 1,
      message: 'Notice: Document is missing an explicit XML declaration "<?xml version="1.0" encoding="UTF-8"?>".',
      severity: 'info',
      rule: 'missing-xml-declaration',
      suggestion: 'Add <?xml version="1.0" encoding="UTF-8"?> at line 1'
    });
  }

  // Tag Stack for Well-Formedness Analysis (XML tags are case sensitive!)
  interface TagStackItem {
    name: string;
    line: number;
    col: number;
    fullTag: string;
  }
  const tagStack: TagStackItem[] = [];
  let rootElementCount = 0;

  // Regex to match XML tags: opening, closing, or self-closing
  // Handles XML namespaces like <xs:schema> or <custom:Node>
  const tagRegex = /<(\/)?([a-zA-Z_][a-zA-Z0-9_\-:]*)([^>]*?)(\/)?>/g;

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Check for unclosed attribute quotes on line (outside comments or cdata)
    let quoteChar: string | null = null;
    let quoteStartCol = 0;

    for (let c = 0; c < lineText.length; c++) {
      const char = lineText[c];
      if (char === '"' || char === "'") {
        if (!quoteChar) {
          quoteChar = char;
          quoteStartCol = c + 1;
        } else if (quoteChar === char) {
          quoteChar = null;
        }
      }
    }

    if (quoteChar && !lineText.includes('-->') && !lineText.includes(']]>')) {
      issues.push({
        id: `xml-unclosed-quote-${lineNum}`,
        line: lineNum,
        column: quoteStartCol,
        message: `Unclosed string attribute quote (${quoteChar}) on line ${lineNum}.`,
        severity: 'error',
        rule: 'unclosed-quote',
        suggestion: `Close attribute quote with ${quoteChar}`
      });
    }

    // Process Tags
    let match: RegExpExecArray | null;
    tagRegex.lastIndex = 0;

    while ((match = tagRegex.exec(lineText)) !== null) {
      const isClosing = Boolean(match[1]);
      const tagName = match[2]; // XML tag names are strict and case-sensitive
      const attributes = match[3] || '';
      const isSelfClosing = Boolean(match[4]);
      const colNum = match.index + 1;

      // Skip Processing Instructions <?...?> or Doctype <!DOCTYPE ...> or CDATA
      if (match[0].startsWith('<?') || match[0].startsWith('<!')) {
        continue;
      }

      // 3. Duplicate Attributes Check in XML
      const attrRegex = /\b([a-zA-Z_][a-zA-Z0-9_\-:]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
      const seenAttrs = new Set<string>();
      let attrMatch: RegExpExecArray | null;

      while ((attrMatch = attrRegex.exec(attributes)) !== null) {
        const attrName = attrMatch[1];
        if (seenAttrs.has(attrName)) {
          issues.push({
            id: `xml-dup-attr-${lineNum}-${colNum}-${attrName}`,
            line: lineNum,
            column: colNum,
            message: `Duplicate attribute "${attrName}" in XML tag <${tagName}>. Attributes in XML must be unique.`,
            severity: 'error',
            rule: 'duplicate-attribute',
            offendingText: attrName,
            suggestion: `Remove duplicate attribute "${attrName}"`
          });
        } else {
          seenAttrs.add(attrName);
        }
      }

      // If opening tag
      if (!isClosing) {
        // Track Root Element Count
        if (tagStack.length === 0) {
          rootElementCount++;
          if (rootElementCount > 1) {
            issues.push({
              id: `xml-multi-root-${lineNum}-${colNum}`,
              line: lineNum,
              column: colNum,
              message: `XML well-formedness violation: Multiple root elements detected ("<${tagName}>"). Valid XML must have exactly one root element.`,
              severity: 'error',
              rule: 'multiple-root-elements',
              tagName,
              suggestion: 'Wrap all elements inside a single parent root container'
            });
          }
        }

        // Push to stack if not self-closing
        if (!isSelfClosing) {
          tagStack.push({
            name: tagName,
            line: lineNum,
            col: colNum,
            fullTag: match[0]
          });
        }
      } else {
        // Closing Tag handling (Strict case-sensitive matching for XML)
        if (tagStack.length > 0) {
          const top = tagStack[tagStack.length - 1];
          if (top.name === tagName) {
            tagStack.pop();
          } else {
            // Check if matching tag exists further up stack
            let foundIdx = -1;
            for (let idx = tagStack.length - 1; idx >= 0; idx--) {
              if (tagStack[idx].name === tagName) {
                foundIdx = idx;
                break;
              }
            }

            if (foundIdx !== -1) {
              const unclosed = tagStack.splice(foundIdx);
              const target = unclosed.pop();
              if (target) {
                unclosed.forEach((unclosedItem) => {
                  issues.push({
                    id: `xml-unclosed-tag-${unclosedItem.line}-${unclosedItem.col}`,
                    line: unclosedItem.line,
                    column: unclosedItem.col,
                    message: `Unclosed XML tag "<${unclosedItem.name}>". Expected closing "</${unclosedItem.name}>" before "</${tagName}>".`,
                    severity: 'error',
                    rule: 'unclosed-tag',
                    tagName: unclosedItem.name,
                    suggestion: `Add </${unclosedItem.name}>`
                  });
                });
              }
            } else {
              issues.push({
                id: `xml-unmatched-close-${lineNum}-${colNum}`,
                line: lineNum,
                column: colNum,
                message: `Unexpected closing tag "</${tagName}>" (case-sensitive) with no matching opening tag "<${tagName}>".`,
                severity: 'error',
                rule: 'unmatched-closing-tag',
                tagName,
                suggestion: `Remove orphan closing tag </${tagName}>`
              });
            }
          }
        } else {
          issues.push({
            id: `xml-unmatched-close-${lineNum}-${colNum}`,
            line: lineNum,
            column: colNum,
            message: `Unexpected closing tag "</${tagName}>" without matching open tag.`,
            severity: 'error',
            rule: 'unmatched-closing-tag',
            tagName,
            suggestion: `Remove orphan closing tag </${tagName}>`
          });
        }
      }
    }
  });

  // Remaining unclosed tags on stack
  tagStack.forEach((unclosed) => {
    issues.push({
      id: `xml-unclosed-tag-end-${unclosed.line}-${unclosed.col}`,
      line: unclosed.line,
      column: unclosed.col,
      message: `Unclosed XML tag "<${unclosed.name}>" opened on line ${unclosed.line}.`,
      severity: 'error',
      rule: 'unclosed-tag',
      tagName: unclosed.name,
      suggestion: `Add </${unclosed.name}>`
    });
  });

  return issues;
}

/**
 * Apply automated quick fixes for XML lint issues
 */
export function applyXmlQuickFix(content: string, issue: XmlLintIssue): string {
  const lines = content.split('\n');
  const targetLineIdx = issue.line - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) return content;

  let lineText = lines[targetLineIdx];

  switch (issue.rule) {
    case 'missing-xml-declaration':
      return `<?xml version="1.0" encoding="UTF-8"?>\n${content}`;

    case 'unclosed-comment':
      return `${content}\n-->`;

    case 'unclosed-cdata':
      return `${content}\n]]>`;

    case 'unclosed-pi':
      return `${content}\n?>`;

    case 'unclosed-tag':
      if (issue.tagName) {
        return `${content}\n</${issue.tagName}>`;
      }
      return content;

    case 'unmatched-closing-tag':
      if (issue.tagName) {
        const removeRegex = new RegExp(`<\\/${issue.tagName}>`, 'g');
        lines[targetLineIdx] = lineText.replace(removeRegex, '');
        return lines.join('\n');
      }
      return content;

    case 'duplicate-attribute':
      if (issue.offendingText) {
        // Remove second occurrence of duplicate attribute
        const attrRegex = new RegExp(`\\b${issue.offendingText}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, 'g');
        let count = 0;
        lineText = lineText.replace(attrRegex, (m) => {
          count++;
          return count > 1 ? '' : m;
        });
        lines[targetLineIdx] = lineText;
        return lines.join('\n');
      }
      return content;

    default:
      return content;
  }
}
