/**
 * Real-time CSS Linter Engine
 * Detects syntax errors, unclosed brackets/comments, missing colons/semicolons,
 * unknown/misspelled CSS properties (with fuzzy suggestion), invalid units & colors,
 * and duplicate property definitions.
 */

export interface CssLintIssue {
  id: string;
  line: number;        // 1-based line number
  column?: number;     // 1-based column offset
  message: string;     // Human readable description
  severity: 'error' | 'warning' | 'info';
  rule: 
    | 'unclosed-comment'
    | 'unclosed-brace'
    | 'unexpected-brace'
    | 'unknown-property'
    | 'missing-colon'
    | 'missing-semicolon'
    | 'duplicate-property'
    | 'invalid-value'
    | 'invalid-color'
    | 'invalid-unit'
    | 'empty-ruleset'
    | 'malformed-selector';
  suggestion?: string; // e.g. "Did you mean 'color'?"
  offendingText?: string;
}

// Standard CSS properties set
export const STANDARD_CSS_PROPERTIES = new Set<string>([
  'accent-color', 'align-content', 'align-items', 'align-self', 'all', 'animation',
  'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode',
  'animation-iteration-count', 'animation-name', 'animation-play-state', 'animation-timing-function',
  'appearance', 'aspect-ratio', 'backdrop-filter', 'backface-visibility', 'background',
  'background-attachment', 'background-blend-mode', 'background-clip', 'background-color',
  'background-image', 'background-origin', 'background-position', 'background-position-x',
  'background-position-y', 'background-repeat', 'background-size', 'block-size',
  'border', 'border-block', 'border-block-color', 'border-block-end', 'border-block-end-color',
  'border-block-end-style', 'border-block-end-width', 'border-block-start', 'border-block-start-color',
  'border-block-start-style', 'border-block-start-width', 'border-block-style', 'border-block-width',
  'border-bottom', 'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color',
  'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice',
  'border-image-source', 'border-image-width', 'border-inline', 'border-inline-color',
  'border-inline-end', 'border-inline-end-color', 'border-inline-end-style', 'border-inline-end-width',
  'border-inline-start', 'border-inline-start-color', 'border-inline-start-style', 'border-inline-start-width',
  'border-inline-style', 'border-inline-width', 'border-left', 'border-left-color',
  'border-left-style', 'border-left-width', 'border-radius', 'border-right',
  'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing',
  'border-style', 'border-top', 'border-top-color', 'border-top-left-radius',
  'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width',
  'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'break-after',
  'break-before', 'break-inside', 'caption-side', 'caret-color', 'clear',
  'clip', 'clip-path', 'color', 'color-scheme', 'column-count', 'column-fill',
  'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style', 'column-rule-width',
  'column-span', 'column-width', 'columns', 'contain', 'contain-intrinsic-size',
  'container', 'container-name', 'container-type', 'content', 'content-visibility',
  'counter-increment', 'counter-reset', 'counter-set', 'cursor', 'direction',
  'display', 'empty-cells', 'filter', 'flex', 'flex-basis', 'flex-direction',
  'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font',
  'font-family', 'font-feature-settings', 'font-kerning', 'font-optical-sizing',
  'font-palette', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style',
  'font-synthesis', 'font-variant', 'font-variant-caps', 'font-variant-east-asian',
  'font-variant-ligatures', 'font-variant-numeric', 'font-weight', 'gap',
  'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow', 'grid-auto-rows',
  'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap',
  'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template',
  'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height',
  'hyphens', 'image-orientation', 'image-rendering', 'inline-size', 'inset',
  'inset-block', 'inset-block-end', 'inset-block-start', 'inset-inline',
  'inset-inline-end', 'inset-inline-start', 'isolation', 'justify-content',
  'justify-items', 'justify-self', 'left', 'letter-spacing', 'line-break',
  'line-height', 'list-style', 'list-style-image', 'list-style-position',
  'list-style-type', 'margin', 'margin-block', 'margin-block-end', 'margin-block-start',
  'margin-bottom', 'margin-inline', 'margin-inline-end', 'margin-inline-start',
  'margin-left', 'margin-right', 'margin-top', 'mask', 'mask-border', 'mask-clip',
  'mask-composite', 'mask-image', 'mask-mode', 'mask-origin', 'mask-position',
  'mask-repeat', 'mask-size', 'mask-type', 'max-block-size', 'max-height',
  'max-inline-size', 'max-width', 'min-block-size', 'min-height', 'min-inline-size',
  'min-width', 'mix-blend-mode', 'object-fit', 'object-position', 'offset',
  'offset-anchor', 'offset-distance', 'offset-path', 'offset-rotate', 'opacity',
  'order', 'orphans', 'outline', 'outline-color', 'outline-offset', 'outline-style',
  'outline-width', 'overflow', 'overflow-anchor', 'overflow-block', 'overflow-clip-margin',
  'overflow-inline', 'overflow-wrap', 'overflow-x', 'overflow-y', 'overscroll-behavior',
  'overscroll-behavior-block', 'overscroll-behavior-inline', 'overscroll-behavior-x',
  'overscroll-behavior-y', 'padding', 'padding-block', 'padding-block-end',
  'padding-block-start', 'padding-bottom', 'padding-inline', 'padding-inline-end',
  'padding-inline-start', 'padding-left', 'padding-right', 'padding-top',
  'page-break-after', 'page-break-before', 'page-break-inside', 'paint-order',
  'perspective', 'perspective-origin', 'place-content', 'place-items',
  'place-self', 'pointer-events', 'position', 'quotes', 'resize', 'right',
  'rotate', 'row-gap', 'scale', 'scroll-behavior', 'scroll-margin',
  'scroll-margin-bottom', 'scroll-margin-left', 'scroll-margin-right', 'scroll-margin-top',
  'scroll-padding', 'scroll-padding-bottom', 'scroll-padding-left', 'scroll-padding-right',
  'scroll-padding-top', 'scroll-snap-align', 'scroll-snap-stop', 'scroll-snap-type',
  'scrollbar-color', 'scrollbar-gutter', 'scrollbar-width', 'shape-image-threshold',
  'shape-margin', 'shape-outside', 'tab-size', 'table-layout', 'text-align',
  'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line',
  'text-decoration-skip-ink', 'text-decoration-style', 'text-decoration-thickness',
  'text-emphasis', 'text-emphasis-color', 'text-emphasis-position', 'text-emphasis-style',
  'text-indent', 'text-justify', 'text-orientation', 'text-overflow', 'text-shadow',
  'text-transform', 'text-underline-offset', 'text-underline-position', 'top',
  'touch-action', 'transform', 'transform-box', 'transform-origin', 'transform-style',
  'transition', 'transition-delay', 'transition-duration', 'transition-property',
  'transition-timing-function', 'translate', 'unicode-bidi', 'user-select',
  'vertical-align', 'visibility', 'white-space', 'widows', 'width', 'will-change',
  'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index'
]);

// Common misspellings and mapping
const COMMON_CSS_ALIASES: Record<string, string> = {
  'colr': 'color',
  'clor': 'color',
  'colour': 'color',
  'backgroud': 'background',
  'backgorund': 'background',
  'bg-color': 'background-color',
  'backgroud-color': 'background-color',
  'paddng': 'padding',
  'pading': 'padding',
  'padin': 'padding',
  'margn': 'margin',
  'mrg': 'margin',
  'widht': 'width',
  'witdh': 'width',
  'heigth': 'height',
  'heght': 'height',
  'dispalay': 'display',
  'displayy': 'display',
  'posistion': 'position',
  'postition': 'position',
  'flex-directon': 'flex-direction',
  'flex-dir': 'flex-direction',
  'justfy-content': 'justify-content',
  'align-item': 'align-items',
  'algn-items': 'align-items',
  'borer': 'border',
  'brder': 'border',
  'border-raduis': 'border-radius',
  'border-radios': 'border-radius',
  'fon-size': 'font-size',
  'fnt-size': 'font-size',
  'font-wieght': 'font-weight',
  'font-wt': 'font-weight',
  'txt-align': 'text-align',
  'transfrom': 'transform',
  'tranisition': 'transition',
  'opacit': 'opacity',
  'zindex': 'z-index',
  'box-shadows': 'box-shadow'
};

// Levenshtein distance helper for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function findPropertySuggestion(prop: string): string | undefined {
  if (COMMON_CSS_ALIASES[prop]) {
    return COMMON_CSS_ALIASES[prop];
  }

  let bestMatch: string | undefined = undefined;
  let minDistance = 3; // threshold max distance

  for (const stdProp of STANDARD_CSS_PROPERTIES) {
    const dist = levenshteinDistance(prop, stdProp);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = stdProp;
    }
  }

  return bestMatch;
}

/**
 * Main CSS Linting Function
 */
export function lintCss(css: string): CssLintIssue[] {
  const issues: CssLintIssue[] = [];
  if (!css || !css.trim()) return issues;

  const lines = css.split('\n');

  // 1. Check for unclosed comments
  let inComment = false;
  let commentStartLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    let cursor = 0;
    while (cursor < line.length) {
      if (!inComment && line.substring(cursor, cursor + 2) === '/*') {
        inComment = true;
        commentStartLine = lineNum;
        cursor += 2;
      } else if (inComment && line.substring(cursor, cursor + 2) === '*/') {
        inComment = false;
        cursor += 2;
      } else {
        cursor++;
      }
    }
  }

  if (inComment) {
    issues.push({
      id: `comment-${commentStartLine}`,
      line: commentStartLine,
      message: `Unclosed CSS comment starting at line ${commentStartLine}`,
      severity: 'error',
      rule: 'unclosed-comment'
    });
  }

  // 2. Bracket matching and block parsing
  let openBraceCount = 0;
  const braceStack: { line: number; col: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Strip comments for structural analysis
    const lineWithoutComments = rawLine.replace(/\/\*[\s\S]*?\*\//g, '');

    for (let c = 0; c < lineWithoutComments.length; c++) {
      const char = lineWithoutComments[c];
      if (char === '{') {
        openBraceCount++;
        braceStack.push({ line: lineNum, col: c + 1 });
      } else if (char === '}') {
        if (openBraceCount === 0) {
          issues.push({
            id: `unexpected-brace-${lineNum}-${c}`,
            line: lineNum,
            column: c + 1,
            message: `Unexpected closing brace '}' with no matching selector`,
            severity: 'error',
            rule: 'unexpected-brace'
          });
        } else {
          openBraceCount--;
          braceStack.pop();
        }
      }
    }
  }

  if (openBraceCount > 0) {
    const lastUnclosed = braceStack[braceStack.length - 1];
    issues.push({
      id: `unclosed-brace-${lastUnclosed.line}`,
      line: lastUnclosed.line,
      column: lastUnclosed.col,
      message: `Unclosed rule block '{' at line ${lastUnclosed.line}`,
      severity: 'error',
      rule: 'unclosed-brace'
    });
  }

  // 3. Line-by-line declaration & selector inspection
  let currentBlockProps = new Map<string, number>(); // prop -> line
  let insideBlock = false;
  let blockStartLine = 1;
  let selectorText = '';
  let blockHasDeclarations = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Ignore comment-only lines or strip inline comments
    let line = rawLine.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!line) continue;

    // Check if line contains '{'
    if (line.includes('{')) {
      const parts = line.split('{');
      selectorText = parts[0].trim();
      insideBlock = true;
      blockStartLine = lineNum;
      currentBlockProps.clear();
      blockHasDeclarations = false;

      // Check selector validity (if not @import, @keyframes, @media, @font-face, etc.)
      if (selectorText && !selectorText.startsWith('@')) {
        // e.g., selector ending with stray comma
        if (selectorText.endsWith(',')) {
          issues.push({
            id: `malformed-selector-${lineNum}`,
            line: lineNum,
            message: `Selector '${selectorText}' ends with trailing comma `,
            severity: 'warning',
            rule: 'malformed-selector'
          });
        }
      }

      // Process content after '{' on the same line if any
      if (parts[1] && !parts[1].includes('}')) {
        line = parts[1].trim();
      } else {
        continue;
      }
    }

    if (line.includes('}')) {
      // Check for empty rulesets
      if (insideBlock && !blockHasDeclarations && selectorText && !selectorText.startsWith('@')) {
        issues.push({
          id: `empty-ruleset-${blockStartLine}`,
          line: blockStartLine,
          message: `Empty CSS rule for '${selectorText}'`,
          severity: 'info',
          rule: 'empty-ruleset'
        });
      }

      insideBlock = false;
      currentBlockProps.clear();

      // Content before '}'
      const parts = line.split('}');
      if (parts[0].trim()) {
        line = parts[0].trim();
      } else {
        continue;
      }
    }

    // Inside declaration block check
    if (insideBlock && line) {
      // Ignore nested @keyframes steps e.g. "0%", "from", "to", "100%"
      if (/^(from|to|\d+%)\s*$/i.test(line)) {
        continue;
      }

      blockHasDeclarations = true;

      // Check if line lacks a colon (e.g. "color red;" or "font-size 16px")
      if (!line.includes(':') && !line.startsWith('@') && !line.startsWith('/*')) {
        issues.push({
          id: `missing-colon-${lineNum}`,
          line: lineNum,
          message: `Missing colon ':' in CSS declaration '${line}'`,
          severity: 'error',
          rule: 'missing-colon',
          offendingText: line
        });
        continue;
      }

      // Check if missing semicolon at the end of declaration
      if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
        issues.push({
          id: `missing-semicolon-${lineNum}`,
          line: lineNum,
          message: `Missing terminating semicolon ';' at the end of declaration`,
          severity: 'warning',
          rule: 'missing-semicolon',
          offendingText: line
        });
      }

      // Split into property and value
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const propRaw = line.substring(0, colonIdx).trim();
        let valRaw = line.substring(colonIdx + 1).trim();
        if (valRaw.endsWith(';')) valRaw = valRaw.slice(0, -1).trim();

        const propLower = propRaw.toLowerCase();

        // 3a. Check for duplicate property in the same selector block
        if (currentBlockProps.has(propLower)) {
          const prevLine = currentBlockProps.get(propLower);
          issues.push({
            id: `duplicate-prop-${lineNum}-${propLower}`,
            line: lineNum,
            message: `Duplicate CSS property '${propRaw}' already defined on line ${prevLine}`,
            severity: 'warning',
            rule: 'duplicate-property',
            offendingText: propRaw
          });
        } else {
          currentBlockProps.set(propLower, lineNum);
        }

        // 3b. Validate property name
        const isCustomVar = propRaw.startsWith('--');
        const isVendorPrefixed = /^-(webkit|moz|ms|o)-/i.test(propRaw);

        if (!isCustomVar && !isVendorPrefixed) {
          if (!STANDARD_CSS_PROPERTIES.has(propLower)) {
            const suggestion = findPropertySuggestion(propLower);
            issues.push({
              id: `unknown-prop-${lineNum}-${propRaw}`,
              line: lineNum,
              message: `Unknown or non-standard CSS property '${propRaw}'${
                suggestion ? `. Did you mean '${suggestion}'?` : ''
              }`,
              severity: 'warning',
              rule: 'unknown-property',
              suggestion,
              offendingText: propRaw
            });
          }
        }

        // 3c. Validate color values (Hex codes, rgb/rgba)
        if (valRaw) {
          // Check invalid hex colors e.g. #12, #12345, #xyz
          const hexMatches = valRaw.match(/#([a-fA-F0-9]+)/g);
          if (hexMatches) {
            for (const hex of hexMatches) {
              const code = hex.substring(1);
              if (![3, 4, 6, 8].includes(code.length)) {
                issues.push({
                  id: `invalid-hex-${lineNum}`,
                  line: lineNum,
                  message: `Invalid hex color code '${hex}' (expected 3, 4, 6, or 8 hex digits)`,
                  severity: 'error',
                  rule: 'invalid-color',
                  offendingText: hex
                });
              }
            }
          }

          // Check for invalid units like 10pxx, 10emm, 100pcent
          const unitMatch = valRaw.match(/\b\d+(?:\.\d+)?([a-zA-Z%]+)\b/g);
          if (unitMatch) {
            const validUnits = new Set([
              'px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax',
              'ch', 'ex', 'pt', 'pc', 'in', 'cm', 'mm', 'deg', 'rad',
              'grad', 'turn', 's', 'ms', 'fr', 'dvh', 'dvw', 'lvh',
              'svh', 'cqw', 'cqh', 'cqmin', 'cqmax', 'dpcm', 'dpi', 'dppx'
            ]);
            for (const token of unitMatch) {
              const match = token.match(/\b\d+(?:\.\d+)?([a-zA-Z%]+)\b/);
              if (match && match[1]) {
                const unit = match[1].toLowerCase();
                if (!validUnits.has(unit)) {
                  issues.push({
                    id: `invalid-unit-${lineNum}-${unit}`,
                    line: lineNum,
                    message: `Unrecognized CSS measurement unit '${unit}' in value '${valRaw}'`,
                    severity: 'warning',
                    rule: 'invalid-unit',
                    offendingText: token
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Quick Fix Utility to auto-repair simple CSS issues
 */
export function applyCssQuickFix(css: string, issue: CssLintIssue): string {
  if (!css || !issue) return css;

  const lines = css.split('\n');
  const targetIndex = issue.line - 1;
  if (targetIndex < 0 || targetIndex >= lines.length) return css;

  let line = lines[targetIndex];

  switch (issue.rule) {
    case 'unknown-property':
      if (issue.suggestion && issue.offendingText) {
        // Replace offending property name with suggestion
        const reg = new RegExp(`\\b${issue.offendingText}\\b`, 'i');
        lines[targetIndex] = line.replace(reg, issue.suggestion);
      }
      break;

    case 'missing-semicolon':
      if (!line.trim().endsWith(';')) {
        lines[targetIndex] = `${line.trimEnd()};`;
      }
      break;

    case 'missing-colon':
      // Try best-effort guess by placing colon after first word
      const words = line.trim().split(/\s+/);
      if (words.length >= 2) {
        lines[targetIndex] = `  ${words[0]}: ${words.slice(1).join(' ')};`;
      }
      break;

    case 'unclosed-brace':
      // Append closing brace
      lines.push('}');
      break;

    case 'unexpected-brace':
      // Delete stray closing brace line
      lines.splice(targetIndex, 1);
      break;

    case 'unclosed-comment':
      lines[targetIndex] = `${line} */`;
      break;

    case 'duplicate-property':
      // Comment out duplicate line
      lines[targetIndex] = `/* ${line.trim()} -- Removed duplicate */`;
      break;

    default:
      break;
  }

  return lines.join('\n');
}
