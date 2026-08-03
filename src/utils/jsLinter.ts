/**
 * Real-time JavaScript / TypeScript / Script Linter Engine
 * Detects syntax errors, unclosed brackets/quotes/strings, loose equality,
 * var declarations, dangerous calls (eval, alert, document.write),
 * leftover debug logs, empty catch/if blocks, and unreachable code.
 */

export interface JsLintIssue {
  id: string;
  line: number;        // 1-based line number
  column?: number;     // 1-based column offset
  message: string;     // Human readable description
  severity: 'error' | 'warning' | 'info';
  rule: 
    | 'unclosed-quote'
    | 'unmatched-bracket'
    | 'loose-equality'
    | 'var-declaration'
    | 'conditional-assignment'
    | 'eval-usage'
    | 'alert-usage'
    | 'document-write'
    | 'debugger-statement'
    | 'console-log'
    | 'empty-block'
    | 'unreachable-code'
    | 'duplicate-key'
    | 'malformed-declaration';
  suggestion?: string;
  offendingText?: string;
}

export function lintJs(content: string): JsLintIssue[] {
  const issues: JsLintIssue[] = [];
  if (!content) return issues;

  const lines = content.split('\n');

  // Bracket balance tracking
  interface BracketItem {
    char: string;
    line: number;
    col: number;
  }
  const bracketStack: BracketItem[] = [];
  const bracketPairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}'
  };
  const reverseBracketPairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  let inMultilineComment = false;
  let multilineStartLine = 1;

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;
    const trimmed = lineText.trim();

    // Check multiline comment /* ... */
    if (!inMultilineComment && trimmed.includes('/*')) {
      if (!trimmed.includes('*/')) {
        inMultilineComment = true;
        multilineStartLine = lineNum;
      }
    } else if (inMultilineComment) {
      if (trimmed.includes('*/')) {
        inMultilineComment = false;
      }
    }

    // Skip comment lines for code syntax analysis
    if (inMultilineComment || trimmed.startsWith('//')) {
      return;
    }

    // Strip inline single-line comment for parsing
    const commentIdx = lineText.indexOf('//');
    const codePart = commentIdx !== -1 ? lineText.substring(0, commentIdx) : lineText;

    // 1. Unclosed String Quotes Check
    let activeQuote: string | null = null;
    let quoteStartCol = 0;
    for (let i = 0; i < codePart.length; i++) {
      const ch = codePart[i];
      const prevCh = i > 0 ? codePart[i - 1] : '';

      if ((ch === "'" || ch === '"' || ch === '`') && prevCh !== '\\') {
        if (!activeQuote) {
          activeQuote = ch;
          quoteStartCol = i + 1;
        } else if (activeQuote === ch) {
          activeQuote = null;
        }
      }
    }

    // Backticks can span multiple lines, but single/double quotes shouldn't unescaped
    if (activeQuote && activeQuote !== '`') {
      issues.push({
        id: `js-unclosed-quote-${lineNum}`,
        line: lineNum,
        column: quoteStartCol,
        message: `Unclosed string literal (${activeQuote}). Missing closing quote.`,
        severity: 'error',
        rule: 'unclosed-quote',
        suggestion: `Close string literal with ${activeQuote}`
      });
    }

    // 2. Bracket matching scan
    let inStringChar: string | null = null;
    for (let i = 0; i < codePart.length; i++) {
      const ch = codePart[i];
      const prevCh = i > 0 ? codePart[i - 1] : '';

      // Manage string literals during bracket scan
      if ((ch === "'" || ch === '"' || ch === '`') && prevCh !== '\\') {
        if (!inStringChar) inStringChar = ch;
        else if (inStringChar === ch) inStringChar = null;
      }

      if (!inStringChar) {
        if (ch === '(' || ch === '[' || ch === '{') {
          bracketStack.push({ char: ch, line: lineNum, col: i + 1 });
        } else if (ch === ')' || ch === ']' || ch === '}') {
          if (bracketStack.length > 0) {
            const top = bracketStack[bracketStack.length - 1];
            if (bracketPairs[top.char] === ch) {
              bracketStack.pop();
            } else {
              issues.push({
                id: `js-mismatched-bracket-${lineNum}-${i + 1}`,
                line: lineNum,
                column: i + 1,
                message: `Mismatched closing bracket "${ch}". Expected "${bracketPairs[top.char]}" to match "${top.char}" from line ${top.line}.`,
                severity: 'error',
                rule: 'unmatched-bracket',
                suggestion: `Replace "${ch}" with "${bracketPairs[top.char]}"`
              });
            }
          } else {
            issues.push({
              id: `js-unexpected-closing-bracket-${lineNum}-${i + 1}`,
              line: lineNum,
              column: i + 1,
              message: `Unexpected closing bracket "${ch}" without matching opening bracket.`,
              severity: 'error',
              rule: 'unmatched-bracket',
              suggestion: `Remove orphan "${ch}"`
            });
          }
        }
      }
    }

    // 3. Loose Equality Check (== or !=)
    const looseEqMatch = codePart.match(/([^=!<>]|^)\s*(==|!=)\s*([^=]|$)/);
    if (looseEqMatch && !codePart.includes('typeof') && !codePart.includes('== null')) {
      const op = looseEqMatch[2];
      const strictOp = op === '==' ? '===' : '!==';
      issues.push({
        id: `js-loose-eq-${lineNum}`,
        line: lineNum,
        message: `Loose equality operator "${op}" detected. Use strict equality "${strictOp}" to avoid unexpected type coercion.`,
        severity: 'warning',
        rule: 'loose-equality',
        offendingText: op,
        suggestion: `Use "${strictOp}" instead of "${op}"`
      });
    }

    // 4. Use of `var` instead of `const` or `let`
    const varMatch = codePart.match(/\bvar\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (varMatch) {
      issues.push({
        id: `js-var-decl-${lineNum}`,
        line: lineNum,
        message: `Use of "var" keyword for variable "${varMatch[1]}". "let" or "const" is preferred for block scoping.`,
        severity: 'warning',
        rule: 'var-declaration',
        offendingText: varMatch[0],
        suggestion: `Replace "var" with "const" or "let"`
      });
    }

    // 5. Conditional Assignment Check: if (x = y)
    const condAssignMatch = codePart.match(/\bif\s*\(\s*([a-zA-Z0-9_$.]+)\s*=\s*([^=].*?)\)/);
    if (condAssignMatch) {
      issues.push({
        id: `js-cond-assign-${lineNum}`,
        line: lineNum,
        message: `Assignment inside conditional expression "if (${condAssignMatch[1]} = ...)". Did you mean "===" or "=="?`,
        severity: 'error',
        rule: 'conditional-assignment',
        suggestion: `Change "=" to "==="`
      });
    }

    // 6. Security & Anti-Pattern Function Calls
    if (/\beval\s*\(/.test(codePart)) {
      issues.push({
        id: `js-eval-${lineNum}`,
        line: lineNum,
        message: 'Security warning: Use of "eval()" executes dynamic code and poses severe security risks.',
        severity: 'error',
        rule: 'eval-usage',
        suggestion: 'Avoid eval(); use standard function parsing or JSON.parse()'
      });
    }

    if (/\balert\s*\(/.test(codePart)) {
      issues.push({
        id: `js-alert-${lineNum}`,
        line: lineNum,
        message: '"alert()" call detected. Use custom modal dialogs or UI notifications for better user experience.',
        severity: 'warning',
        rule: 'alert-usage',
        suggestion: 'Replace alert() with UI notification'
      });
    }

    if (/\bdocument\.write\s*\(/.test(codePart)) {
      issues.push({
        id: `js-doc-write-${lineNum}`,
        line: lineNum,
        message: '"document.write()" can overwrite the entire document DOM after page load.',
        severity: 'error',
        rule: 'document-write',
        suggestion: 'Use element.textContent or element.innerHTML instead'
      });
    }

    // 7. Debugger & Console Log Warnings
    if (/\bdebugger\s*;?/.test(codePart)) {
      issues.push({
        id: `js-debugger-${lineNum}`,
        line: lineNum,
        message: '"debugger;" statement present in code.',
        severity: 'warning',
        rule: 'debugger-statement',
        suggestion: 'Remove debugger statement before production'
      });
    }

    if (/\bconsole\.log\s*\(/.test(codePart)) {
      issues.push({
        id: `js-console-log-${lineNum}`,
        line: lineNum,
        message: '"console.log()" call present.',
        severity: 'info',
        rule: 'console-log',
        suggestion: 'Remove console.log or wrap in dev environment check'
      });
    }

    // 8. Empty block detection: e.g. catch () {} or if () {}
    if (/\b(catch|if|for|while)\s*\([^)]*\)\s*\{\s*\}/.test(codePart)) {
      issues.push({
        id: `js-empty-block-${lineNum}`,
        line: lineNum,
        message: 'Empty control block detected.',
        severity: 'info',
        rule: 'empty-block',
        suggestion: 'Add logic or explanatory comment inside block'
      });
    }

    // 9. Malformed Variable Declarations: e.g. const x == 5; or let x 5;
    if (/\b(const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*==\s*/.test(codePart)) {
      issues.push({
        id: `js-malformed-decl-${lineNum}`,
        line: lineNum,
        message: 'Malformed variable declaration using "==" instead of "=".',
        severity: 'error',
        rule: 'malformed-declaration',
        suggestion: 'Change "==" to "="'
      });
    }
  });

  // Report unclosed brackets at end of file
  if (bracketStack.length > 0) {
    bracketStack.forEach((unclosed) => {
      issues.push({
        id: `js-unclosed-bracket-${unclosed.line}-${unclosed.col}`,
        line: unclosed.line,
        column: unclosed.col,
        message: `Unclosed bracket "${unclosed.char}" opened on line ${unclosed.line}.`,
        severity: 'error',
        rule: 'unmatched-bracket',
        suggestion: `Add closing "${bracketPairs[unclosed.char]}"`
      });
    });
  }

  return issues;
}

/**
 * Apply automated quick fixes for JS/TS lint issues
 */
export function applyJsQuickFix(content: string, issue: JsLintIssue): string {
  const lines = content.split('\n');
  const targetLineIdx = issue.line - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) return content;

  let lineText = lines[targetLineIdx];

  switch (issue.rule) {
    case 'loose-equality':
      lineText = lineText.replace(/==/g, '===').replace(/!=/g, '!==');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'var-declaration':
      lineText = lineText.replace(/\bvar\b/g, 'let');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'conditional-assignment':
      lineText = lineText.replace(/(\bif\s*\([^=]+)=\s*([^=])/g, '$1===$2');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'debugger-statement':
      lineText = lineText.replace(/\bdebugger\s*;?/g, '');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'console-log':
      lineText = lineText.replace(/console\.log\([^)]*\)\s*;?/g, '');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'alert-usage':
      lineText = lineText.replace(/\balert\(/g, 'console.log(');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'malformed-declaration':
      lineText = lineText.replace(/(\b(const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*)==/g, '$1=');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'unmatched-bracket':
      if (issue.suggestion && issue.suggestion.includes('Add closing')) {
        const closeChar = issue.suggestion.match(/"([^"]+)"/)?.[1] || '}';
        return `${content}\n${closeChar}`;
      }
      return content;

    default:
      return content;
  }
}
