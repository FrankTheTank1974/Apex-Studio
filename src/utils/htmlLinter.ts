/**
 * Real-time HTML / HTM Linter Engine
 * Detects structural errors, unclosed tags/comments, missing attributes,
 * accessibility (WCAG) violations, duplicate IDs, and deprecated tags.
 */

export interface HtmlLintIssue {
  id: string;
  line: number;        // 1-based line number
  column?: number;     // 1-based column offset
  message: string;     // Human readable description
  severity: 'error' | 'warning' | 'info';
  rule: 
    | 'unclosed-comment'
    | 'unclosed-tag'
    | 'unmatched-closing-tag'
    | 'unclosed-quote'
    | 'missing-alt'
    | 'missing-href'
    | 'duplicate-id'
    | 'deprecated-tag'
    | 'empty-interactive-element'
    | 'missing-doctype'
    | 'uppercase-tag'
    | 'inline-event-handler'
    | 'malformed-attribute';
  suggestion?: string;
  offendingText?: string;
  tagName?: string;
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const DEPRECATED_TAGS: Record<string, string> = {
  center: 'Use CSS text-align: center or flexbox layout instead',
  font: 'Use CSS font-family, color, and font-size properties',
  marquee: 'Use CSS animations or marquee keyframes',
  blink: 'Use CSS animations instead',
  strike: 'Use <s>, <del>, or CSS text-decoration: line-through',
  big: 'Use CSS font-size property',
  tt: 'Use <code>, <kbd>, or CSS font-family: monospace',
  dir: 'Use <ul> or <ol> list elements',
  applet: 'Use <object> or modern web standards',
  basefont: 'Use CSS styling'
};

export function lintHtml(content: string): HtmlLintIssue[] {
  const issues: HtmlLintIssue[] = [];
  if (!content) return issues;

  const lines = content.split('\n');

  // 1. Unclosed HTML comments check
  let inComment = false;
  let commentStartLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    if (!inComment && line.includes('<!--')) {
      // Check if comment closes on same line
      const commentStartIdx = line.indexOf('<!--');
      const commentEndIdx = line.indexOf('-->', commentStartIdx + 4);

      if (commentEndIdx === -1) {
        inComment = true;
        commentStartLine = lineNum;
      }
    } else if (inComment) {
      if (line.includes('-->')) {
        inComment = false;
      }
    }
  }

  if (inComment) {
    issues.push({
      id: `html-unclosed-comment-${commentStartLine}`,
      line: commentStartLine,
      message: 'Unclosed HTML comment. Missing closing "-->".',
      severity: 'error',
      rule: 'unclosed-comment',
      suggestion: 'Add "-->" to close the comment'
    });
  }

  // 2. DOCTYPE check for full documents
  const lowerContent = content.toLowerCase();
  const isFullDocument = lowerContent.includes('<html') || lowerContent.includes('<body') || lowerContent.includes('<head');
  if (isFullDocument && !lowerContent.includes('<!doctype html>')) {
    issues.push({
      id: 'html-missing-doctype-1',
      line: 1,
      message: 'Missing standard "<!DOCTYPE html>" declaration at beginning of document.',
      severity: 'warning',
      rule: 'missing-doctype',
      suggestion: 'Add <!DOCTYPE html> at line 1'
    });
  }

  // 3. ID Duplicate Tracking
  const idMap = new Map<string, number[]>();

  // Tag Stack for Tag Matching Analysis
  interface TagStackItem {
    name: string;
    line: number;
    col: number;
    fullTag: string;
  }
  const tagStack: TagStackItem[] = [];

  // 4. Line-by-line / Tag-by-Tag Parsing
  const tagRegex = /<(\/)?([a-zA-Z0-9:-]+)([^>]*?)(\/)?>/g;

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Check for unclosed attribute quotes on line
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

    if (quoteChar && lineText.trim().endsWith('<') === false) {
      // Unclosed quote on line warning
      issues.push({
        id: `html-unclosed-quote-${lineNum}`,
        line: lineNum,
        column: quoteStartCol,
        message: `Unclosed string literal attribute quote (${quoteChar}) on line.`,
        severity: 'error',
        rule: 'unclosed-quote',
        suggestion: `Close the attribute quote with ${quoteChar}`
      });
    }

    // Process Tags
    let match: RegExpExecArray | null;
    tagRegex.lastIndex = 0;

    while ((match = tagRegex.exec(lineText)) !== null) {
      const isClosing = Boolean(match[1]);
      const rawTagName = match[2];
      const tagName = rawTagName.toLowerCase();
      const attributes = match[3] || '';
      const isSelfClosingSlash = Boolean(match[4]);
      const colNum = match.index + 1;

      // Check uppercase tag name
      if (rawTagName !== tagName && !['DOCTYPE'].includes(rawTagName)) {
        issues.push({
          id: `html-uppercase-${lineNum}-${colNum}`,
          line: lineNum,
          column: colNum,
          message: `Uppercase tag name "<${rawTagName}>". Standard HTML5 recommends lowercase "<${tagName}>".`,
          severity: 'info',
          rule: 'uppercase-tag',
          tagName,
          suggestion: `Change <${rawTagName}> to <${tagName}>`
        });
      }

      // Check Deprecated Tags
      if (DEPRECATED_TAGS[tagName]) {
        issues.push({
          id: `html-deprecated-${lineNum}-${colNum}`,
          line: lineNum,
          column: colNum,
          message: `Deprecated HTML tag "<${tagName}>". ${DEPRECATED_TAGS[tagName]}.`,
          severity: 'warning',
          rule: 'deprecated-tag',
          tagName,
          suggestion: DEPRECATED_TAGS[tagName]
        });
      }

      // If opening tag
      if (!isClosing) {
        // Extract ID attributes to check duplicates
        const idMatch = attributes.match(/\bid=["']([^"']+)["']/i);
        if (idMatch && idMatch[1]) {
          const idValue = idMatch[1];
          const existing = idMap.get(idValue) || [];
          existing.push(lineNum);
          idMap.set(idValue, existing);
        }

        // Accessibility: <img> missing alt attribute
        if (tagName === 'img') {
          const hasAlt = /\balt\s*=\s*["']/i.test(attributes);
          if (!hasAlt) {
            issues.push({
              id: `html-img-missing-alt-${lineNum}-${colNum}`,
              line: lineNum,
              column: colNum,
              message: 'Accessibility violation: <img> tag is missing an "alt" attribute.',
              severity: 'warning',
              rule: 'missing-alt',
              offendingText: match[0],
              suggestion: 'Add alt="Descriptive image text"'
            });
          }
        }

        // Accessibility: <a> missing href or empty href="#"
        if (tagName === 'a') {
          const hrefMatch = attributes.match(/\bhref\s*=\s*["']([^"']*)["']/i);
          if (!hrefMatch) {
            issues.push({
              id: `html-a-missing-href-${lineNum}-${colNum}`,
              line: lineNum,
              column: colNum,
              message: 'Anchor link <a> tag is missing an "href" attribute.',
              severity: 'warning',
              rule: 'missing-href',
              suggestion: 'Add href="#" or valid URL'
            });
          } else if (hrefMatch[1] === '#') {
            issues.push({
              id: `html-a-hash-href-${lineNum}-${colNum}`,
              line: lineNum,
              column: colNum,
              message: 'Anchor link has placeholder "href="#"". Consider adding target section or javascript handle.',
              severity: 'info',
              rule: 'missing-href',
              suggestion: 'Replace "#" with target element ID'
            });
          }
        }

        // Inline event handlers (e.g. onclick="...")
        const inlineHandlerMatch = attributes.match(/\bon[a-z]+\s*=\s*["']/i);
        if (inlineHandlerMatch) {
          issues.push({
            id: `html-inline-event-${lineNum}-${colNum}`,
            line: lineNum,
            column: colNum,
            message: `Inline event listener detected in HTML tag (${inlineHandlerMatch[0].trim()}). Consider using addEventListener in JS.`,
            severity: 'info',
            rule: 'inline-event-handler'
          });
        }

        // Push to tag stack if not self-closing or void
        if (!VOID_TAGS.has(tagName) && !isSelfClosingSlash) {
          tagStack.push({
            name: tagName,
            line: lineNum,
            col: colNum,
            fullTag: match[0]
          });
        }
      } else {
        // Closing Tag handling
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
              // Unclosed tags between foundIdx and top
              const unclosed = tagStack.splice(foundIdx);
              const target = unclosed.pop();
              if (target) {
                unclosed.forEach(unclosedItem => {
                  issues.push({
                    id: `html-unclosed-tag-${unclosedItem.line}-${unclosedItem.col}`,
                    line: unclosedItem.line,
                    column: unclosedItem.col,
                    message: `Unclosed tag "<${unclosedItem.name}>". Expected closing "</${unclosedItem.name}>" before "</${tagName}>".`,
                    severity: 'error',
                    rule: 'unclosed-tag',
                    tagName: unclosedItem.name,
                    suggestion: `Add </${unclosedItem.name}>`
                  });
                });
              }
            } else {
              issues.push({
                id: `html-unmatched-close-${lineNum}-${colNum}`,
                line: lineNum,
                column: colNum,
                message: `Unexpected closing tag "</${tagName}>" with no matching open tag.`,
                severity: 'error',
                rule: 'unmatched-closing-tag',
                tagName,
                suggestion: `Remove orphan </${tagName}>`
              });
            }
          }
        } else {
          issues.push({
            id: `html-unmatched-close-${lineNum}-${colNum}`,
            line: lineNum,
            column: colNum,
            message: `Unexpected closing tag "</${tagName}>" without matching open tag.`,
            severity: 'error',
            rule: 'unmatched-closing-tag',
            tagName,
            suggestion: `Remove orphan </${tagName}>`
          });
        }
      }
    }
  });

  // Remaining items on tagStack are unclosed tags
  tagStack.forEach((unclosed) => {
    issues.push({
      id: `html-unclosed-tag-end-${unclosed.line}-${unclosed.col}`,
      line: unclosed.line,
      column: unclosed.col,
      message: `Unclosed HTML element "<${unclosed.name}>" opened on line ${unclosed.line}.`,
      severity: 'error',
      rule: 'unclosed-tag',
      tagName: unclosed.name,
      suggestion: `Add </${unclosed.name}> to close element`
    });
  });

  // Report Duplicate IDs
  idMap.forEach((linesList, idValue) => {
    if (linesList.length > 1) {
      linesList.forEach((ln) => {
        issues.push({
          id: `html-duplicate-id-${idValue}-${ln}`,
          line: ln,
          message: `Duplicate HTML attribute id="${idValue}" defined on multiple lines (${linesList.join(', ')}). IDs must be unique.`,
          severity: 'warning',
          rule: 'duplicate-id',
          suggestion: 'Change to unique ID or use class attribute'
        });
      });
    }
  });

  return issues;
}

/**
 * Apply automated quick fixes for HTML lint issues
 */
export function applyHtmlQuickFix(content: string, issue: HtmlLintIssue): string {
  const lines = content.split('\n');
  const targetLineIdx = issue.line - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) return content;

  let lineText = lines[targetLineIdx];

  switch (issue.rule) {
    case 'missing-alt':
      // Add alt="" attribute to <img>
      lineText = lineText.replace(/<img\b([^>]*)\/?>/i, (m, p1) => {
        return `<img${p1} alt="Image description">`;
      });
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'missing-href':
      // Add href="#"
      lineText = lineText.replace(/<a\b([^>]*)\/?>/i, (m, p1) => {
        return `<a${p1} href="#">`;
      });
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'uppercase-tag':
      if (issue.tagName) {
        const regex = new RegExp(`<(\\/?)${issue.tagName}([^>]*?)>`, 'gi');
        lineText = lineText.replace(regex, (m, slash, rest) => `<${slash}${issue.tagName.toLowerCase()}${rest}>`);
        lines[targetLineIdx] = lineText;
      }
      return lines.join('\n');

    case 'deprecated-tag':
      if (issue.tagName === 'center') {
        lineText = lineText.replace(/<center>/gi, '<div style="text-align: center;">').replace(/<\/center>/gi, '</div>');
        lines[targetLineIdx] = lineText;
      } else if (issue.tagName === 'font') {
        lineText = lineText.replace(/<font\b/gi, '<span').replace(/<\/font>/gi, '</span>');
        lines[targetLineIdx] = lineText;
      } else if (issue.tagName === 'strike') {
        lineText = lineText.replace(/<strike>/gi, '<s>').replace(/<\/strike>/gi, '</s>');
        lines[targetLineIdx] = lineText;
      }
      return lines.join('\n');

    case 'missing-doctype':
      return `<!DOCTYPE html>\n${content}`;

    case 'unclosed-comment':
      return `${content}\n-->`;

    case 'unclosed-tag':
      if (issue.tagName) {
        return `${content}\n</${issue.tagName}>`;
      }
      return content;

    case 'unmatched-closing-tag':
      if (issue.tagName) {
        const removeRegex = new RegExp(`<\\/${issue.tagName}>`, 'i');
        lines[targetLineIdx] = lineText.replace(removeRegex, '');
        return lines.join('\n');
      }
      return content;

    default:
      return content;
  }
}
