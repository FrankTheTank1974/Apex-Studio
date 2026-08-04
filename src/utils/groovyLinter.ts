/**
 * Real-time GroovyScript Linter Engine
 * Detects syntax errors, unclosed brackets/quotes, Java-style anti-patterns,
 * redundant keywords, malformed Elvis operators, trailing semicolons,
 * conditional assignments, and unhandled empty blocks.
 */

export interface GroovyLintIssue {
  id: string;
  line: number;        // 1-based line number
  column?: number;     // 1-based column offset
  message: string;     // Human readable description
  severity: 'error' | 'warning' | 'info';
  rule: 
    | 'unclosed-quote'
    | 'unmatched-bracket'
    | 'redundant-def-keyword'
    | 'java-print-statement'
    | 'var-keyword'
    | 'malformed-elvis'
    | 'conditional-assignment'
    | 'unnecessary-semicolon'
    | 'empty-block'
    | 'eval-usage'
    | 'triple-eq-usage';
  suggestion?: string;
  offendingText?: string;
}

export function lintGroovy(content: string): GroovyLintIssue[] {
  const issues: GroovyLintIssue[] = [];
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

  let inMultilineComment = false;

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;
    const trimmed = lineText.trim();

    // Multiline comment check /* ... */
    if (!inMultilineComment && trimmed.includes('/*')) {
      if (!trimmed.includes('*/')) {
        inMultilineComment = true;
      }
    } else if (inMultilineComment) {
      if (trimmed.includes('*/')) {
        inMultilineComment = false;
      }
    }

    // Skip comments for syntax scanning
    if (inMultilineComment || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // Strip inline single-line comment for code parsing
    const commentIdx = lineText.indexOf('//');
    const codePart = commentIdx !== -1 ? lineText.substring(0, commentIdx) : lineText;

    // 1. Check Unclosed String Quotes
    let activeQuote: string | null = null;
    let quoteStartCol = 0;

    for (let i = 0; i < codePart.length; i++) {
      const ch = codePart[i];
      const prevCh = i > 0 ? codePart[i - 1] : '';

      if ((ch === "'" || ch === '"') && prevCh !== '\\') {
        if (!activeQuote) {
          activeQuote = ch;
          quoteStartCol = i + 1;
        } else if (activeQuote === ch) {
          activeQuote = null;
        }
      }
    }

    if (activeQuote) {
      issues.push({
        id: `groovy-unclosed-quote-${lineNum}`,
        line: lineNum,
        column: quoteStartCol,
        message: `Unclosed string literal (${activeQuote}). Missing closing quote.`,
        severity: 'error',
        rule: 'unclosed-quote',
        suggestion: `Close string literal with ${activeQuote}`
      });
    }

    // 2. Bracket Balance Scan
    let inStringChar: string | null = null;
    for (let i = 0; i < codePart.length; i++) {
      const ch = codePart[i];
      const prevCh = i > 0 ? codePart[i - 1] : '';

      if ((ch === "'" || ch === '"') && prevCh !== '\\') {
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
                id: `groovy-mismatched-bracket-${lineNum}-${i + 1}`,
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
              id: `groovy-unexpected-closing-${lineNum}-${i + 1}`,
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

    // 3. Redundant 'def' + Explicit Type (e.g. def String name)
    const redundantDefMatch = codePart.match(/\bdef\s+(String|int|double|boolean|float|long|short|byte|char|List|Map|Set|Object|def)\b/);
    if (redundantDefMatch) {
      issues.push({
        id: `groovy-redundant-def-${lineNum}`,
        line: lineNum,
        message: `Redundant "def" keyword combined with explicit type "${redundantDefMatch[1]}". In Groovy, use either "def" or explicit type, not both.`,
        severity: 'warning',
        rule: 'redundant-def-keyword',
        offendingText: redundantDefMatch[0],
        suggestion: `Remove "def" and keep "${redundantDefMatch[1]}"`
      });
    }

    // 4. Verbose Java-style Print Statement (System.out.println)
    if (/\bSystem\.out\.print(ln)?\b/.test(codePart)) {
      issues.push({
        id: `groovy-java-print-${lineNum}`,
        line: lineNum,
        message: `Verbose Java-style "System.out.print" detected. Idiomatic Groovy uses "println()" or "print()".`,
        severity: 'info',
        rule: 'java-print-statement',
        offendingText: 'System.out.println',
        suggestion: 'Replace with "println()"'
      });
    }

    // 5. 'var' Keyword Usage (Groovy prefers 'def' or type)
    const varMatch = codePart.match(/\bvar\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (varMatch) {
      issues.push({
        id: `groovy-var-decl-${lineNum}`,
        line: lineNum,
        message: `Use of "var" keyword for variable "${varMatch[1]}". "def" is idiomatic in Groovy.`,
        severity: 'warning',
        rule: 'var-keyword',
        offendingText: varMatch[0],
        suggestion: `Replace "var" with "def"`
      });
    }

    // 6. Malformed Elvis Operator (space between ? and :)
    if (/\?\s+:/.test(codePart)) {
      issues.push({
        id: `groovy-malformed-elvis-${lineNum}`,
        line: lineNum,
        message: `Whitespace detected inside Elvis operator "? :". Use contiguous "?:" in Groovy.`,
        severity: 'error',
        rule: 'malformed-elvis',
        suggestion: 'Change "? :" to "?:"'
      });
    }

    // 7. Conditional Assignment in 'if (x = y)'
    const condAssignMatch = codePart.match(/\bif\s*\(\s*([a-zA-Z0-9_$.]+)\s*=\s*([^=].*?)\)/);
    if (condAssignMatch) {
      issues.push({
        id: `groovy-cond-assign-${lineNum}`,
        line: lineNum,
        message: `Assignment inside conditional expression "if (${condAssignMatch[1]} = ...)". Did you mean "=="?`,
        severity: 'error',
        rule: 'conditional-assignment',
        suggestion: 'Change "=" to "=="'
      });
    }

    // 8. Unnecessary Trailing Semicolon (Groovy Style Guide)
    if (codePart.trim().endsWith(';') && !codePart.includes('for(') && !codePart.includes('for (')) {
      issues.push({
        id: `groovy-semicolon-${lineNum}`,
        line: lineNum,
        message: 'Unnecessary trailing semicolon. Groovy statements do not require semicolons at line ends.',
        severity: 'info',
        rule: 'unnecessary-semicolon',
        offendingText: ';',
        suggestion: 'Remove trailing semicolon'
      });
    }

    // 9. Empty Catch or Closure Block
    if (/\b(catch|if|for|while)\s*\([^)]*\)\s*\{\s*\}/.test(codePart)) {
      issues.push({
        id: `groovy-empty-block-${lineNum}`,
        line: lineNum,
        message: 'Empty control block detected.',
        severity: 'info',
        rule: 'empty-block',
        suggestion: 'Add code or explanatory comment inside block'
      });
    }

    // 10. Security Eval.me(...) Usage
    if (/\bEval\.(me|x|xy|xyz)\s*\(/.test(codePart)) {
      issues.push({
        id: `groovy-eval-${lineNum}`,
        line: lineNum,
        message: 'Security notice: Dynamic Groovy "Eval.me()" executes arbitrary code and can lead to remote code execution.',
        severity: 'error',
        rule: 'eval-usage',
        suggestion: 'Avoid Eval.me(); use pre-parsed GroovyScript'
      });
    }

    // 11. Strict Equality '===' vs Groovy '=='
    if (codePart.includes('===')) {
      issues.push({
        id: `groovy-triple-eq-${lineNum}`,
        line: lineNum,
        message: 'Triple-equals "===" operator detected. In Groovy, use "==" for value equality or ".is()" for identity comparison.',
        severity: 'warning',
        rule: 'triple-eq-usage',
        offendingText: '===',
        suggestion: 'Replace "===" with "=="'
      });
    }
  });

  // Check unclosed brackets
  if (bracketStack.length > 0) {
    bracketStack.forEach((unclosed) => {
      issues.push({
        id: `groovy-unclosed-bracket-${unclosed.line}-${unclosed.col}`,
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
 * Apply automated quick fixes for Groovy lint issues
 */
export function applyGroovyQuickFix(content: string, issue: GroovyLintIssue): string {
  const lines = content.split('\n');
  const targetLineIdx = issue.line - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) return content;

  let lineText = lines[targetLineIdx];

  switch (issue.rule) {
    case 'redundant-def-keyword':
      lineText = lineText.replace(/\bdef\s+(String|int|double|boolean|float|long|short|byte|char|List|Map|Set|Object)\b/g, '$1');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'java-print-statement':
      lineText = lineText.replace(/System\.out\.println/g, 'println').replace(/System\.out\.print/g, 'print');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'var-keyword':
      lineText = lineText.replace(/\bvar\b/g, 'def');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'malformed-elvis':
      lineText = lineText.replace(/\?\s+:/g, '?:');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'conditional-assignment':
      lineText = lineText.replace(/(\bif\s*\([^=]+)=\s*([^=])/g, '$1==$2');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'unnecessary-semicolon':
      // Strip trailing semicolon from the line
      lineText = lineText.replace(/;\s*$/, '');
      lines[targetLineIdx] = lineText;
      return lines.join('\n');

    case 'triple-eq-usage':
      lineText = lineText.replace(/===/g, '==');
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
