/**
 * Lightweight, robust Syntax Highlighter for HTML, CSS, JS, TS, and Groovy
 */

export function highlightCodeToHTML(code: string, type: string, isDark: boolean = true): string {
  if (!code) return '';

  // Escape HTML entities first to prevent rendering unsafe tags in overlay
  let safe = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Theme colors
  const colors = isDark ? {
    keyword: 'text-purple-400 font-semibold',
    string: 'text-emerald-300',
    comment: 'text-slate-500 italic',
    number: 'text-amber-300',
    type: 'text-sky-300 font-medium',
    tag: 'text-pink-400 font-semibold',
    attrName: 'text-cyan-300',
    attrVal: 'text-emerald-300',
    groovyExt: 'text-emerald-400 font-bold',
    cssProp: 'text-sky-300',
    cssVal: 'text-amber-300',
    cssSel: 'text-yellow-300 font-semibold',
    operator: 'text-pink-300',
  } : {
    keyword: 'text-purple-700 font-semibold',
    string: 'text-emerald-700',
    comment: 'text-slate-400 italic',
    number: 'text-amber-700',
    type: 'text-sky-700 font-medium',
    tag: 'text-pink-700 font-semibold',
    attrName: 'text-cyan-700',
    attrVal: 'text-emerald-700',
    groovyExt: 'text-emerald-700 font-bold',
    cssProp: 'text-sky-700',
    cssVal: 'text-amber-700',
    cssSel: 'text-amber-800 font-semibold',
    operator: 'text-pink-600',
  };

  // Placeholders mapping for matched tokens to avoid double replacement
  const tokens: string[] = [];
  const tokenMarker = (idx: number) => `___TOK_${idx}___`;

  const saveToken = (html: string) => {
    const idx = tokens.length;
    tokens.push(html);
    return tokenMarker(idx);
  };

  if (type === 'html') {
    // 1. Comments
    safe = safe.replace(/&lt;!--[\s\S]*?--&gt;/g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. HTML Tags & attributes
    safe = safe.replace(/(&lt;\/?)([a-zA-Z0-9\-]+)((?:\s+[a-zA-Z0-9\-]+(?:=(?:"[^"]*"|'[^']*'|[^\s&gt;]+))?)*\s*)(\/?&gt;)/g, (match, open, tag, attrs, close) => {
      let highlightedAttrs = attrs;
      highlightedAttrs = highlightedAttrs.replace(/([a-zA-Z0-9\-]+)=("[^"]*"|'[^']*'|[^\s&gt;]+)/g, (_m: string, aName: string, aVal: string) => {
        return `<span class="${colors.attrName}">${aName}</span>=<span class="${colors.attrVal}">${aVal}</span>`;
      });
      highlightedAttrs = highlightedAttrs.replace(/\s+([a-zA-Z0-9\-]+)(?=\s|\/|&gt;|$)/g, (_m: string, aName: string) => {
        return ` <span class="${colors.attrName}">${aName}</span>`;
      });

      return saveToken(`<span class="${colors.tag}">${open}${tag}</span>${highlightedAttrs}<span class="${colors.tag}">${close}</span>`);
    });

  } else if (type === 'css') {
    // 1. Comments
    safe = safe.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. CSS Strings
    safe = safe.replace(/("[^"]*"|'[^']*')/g, (match) => {
      return saveToken(`<span class="${colors.string}">${match}</span>`);
    });

    // 3. Properties and values
    safe = safe.replace(/([a-zA-Z\-]+)\s*:\s*([^;\}]+)(;?)/g, (_match, prop, val, semi) => {
      return saveToken(`<span class="${colors.cssProp}">${prop}</span>: <span class="${colors.cssVal}">${val}</span>${semi}`);
    });

    // 4. Selectors
    safe = safe.replace(/([\.#]?[a-zA-Z0-9_\-\s,>+~:]+)(?=\s*\{)/g, (match) => {
      return saveToken(`<span class="${colors.cssSel}">${match}</span>`);
    });

  } else {
    // JS, TS, GROOVY

    // 1. Single and multi-line comments
    safe = safe.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. Strings
    safe = safe.replace(/("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/g, (match) => {
      return saveToken(`<span class="${colors.string}">${match}</span>`);
    });

    // 3. Groovy / JS / TS Keywords
    const keywords = [
      'def', 'println', 'print', 'assert', 'each', 'collect', 'findAll', 'sum',
      'function', 'const', 'let', 'var', 'class', 'interface', 'type', 'export',
      'import', 'from', 'return', 'if', 'else', 'for', 'while', 'switch', 'case',
      'break', 'continue', 'new', 'this', 'super', 'extends', 'implements',
      'public', 'private', 'protected', 'static', 'void', 'async', 'await',
      'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'as', 'in', 'of'
    ];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    safe = safe.replace(kwRegex, (match) => {
      if (['def', 'println', 'print', 'assert'].includes(match)) {
        return saveToken(`<span class="${colors.groovyExt}">${match}</span>`);
      }
      return saveToken(`<span class="${colors.keyword}">${match}</span>`);
    });

    // 4. TS Types & Builtins
    const types = ['string', 'number', 'boolean', 'any', 'void', 'unknown', 'never', 'object', 'Record', 'Array', 'Promise', 'UserConfig', 'AppController', 'GroovyRuntime'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    safe = safe.replace(typeRegex, (match) => {
      return saveToken(`<span class="${colors.type}">${match}</span>`);
    });

    // 5. Numbers
    safe = safe.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
      return saveToken(`<span class="${colors.number}">${match}</span>`);
    });

    // 6. Operators
    safe = safe.replace(/(=&gt;|&gt;|&lt;|==|===|!=|!==|&amp;&amp;|\|\||\?:\s*|\.\.)/g, (match) => {
      return saveToken(`<span class="${colors.operator}">${match}</span>`);
    });
  }

  // Restore saved tokens
  for (let i = 0; i < tokens.length; i++) {
    safe = safe.replace(tokenMarker(i), tokens[i]);
  }

  return safe;
}
