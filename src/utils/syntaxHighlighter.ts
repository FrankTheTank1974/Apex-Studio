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
    annotation: 'text-amber-400 font-bold',
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
    annotation: 'text-amber-600 font-bold',
  };

  // Placeholders mapping for matched tokens to avoid double replacement
  const tokens: string[] = [];
  const tokenMarker = (idx: number) => `___TOK_${idx}___`;

  const saveToken = (html: string) => {
    const idx = tokens.length;
    tokens.push(html);
    return tokenMarker(idx);
  };

  if (type === 'xml' || type === 'html') {
    // 1. Comments
    safe = safe.replace(/&lt;!--[\s\S]*?--&gt;/g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. XML Processing Instructions & Declarations (<?xml ... ?>, <?target ... ?>)
    safe = safe.replace(/&lt;\?[a-zA-Z0-9_\-:]*[\s\S]*?\?&gt;/g, (match) => {
      return saveToken(`<span class="${colors.annotation}">${match}</span>`);
    });

    // 3. CDATA Sections (<![CDATA[ ... ]])
    safe = safe.replace(/&lt;!\[CDATA\[[\s\S]*?\]\]&gt;/g, (match) => {
      return saveToken(`<span class="${colors.type}">${match}</span>`);
    });

    // 4. DOCTYPE / DTD Declarations (<!DOCTYPE ...>)
    safe = safe.replace(/&lt;!DOCTYPE[\s\S]*?&gt;/gi, (match) => {
      return saveToken(`<span class="${colors.keyword}">${match}</span>`);
    });

    // 5. XML/HTML Tags & attributes (handles XML namespaces like <xs:schema>, <ns:element>)
    safe = safe.replace(/(&lt;\/?)([a-zA-Z0-9_\-:]+)((?:\s+[a-zA-Z0-9_\-:]+(?:=(?:"[^"]*"|'[^']*'|[^\s&gt;]+))?)*\s*)(\/?&gt;)/g, (match, open, tag, attrs, close) => {
      let highlightedAttrs = attrs;
      highlightedAttrs = highlightedAttrs.replace(/([a-zA-Z0-9_\-:]+)=("[^"]*"|'[^']*'|[^\s&gt;]+)/g, (_m: string, aName: string, aVal: string) => {
        return `<span class="${colors.attrName}">${aName}</span>=<span class="${colors.attrVal}">${aVal}</span>`;
      });
      highlightedAttrs = highlightedAttrs.replace(/\s+([a-zA-Z0-9_\-:]+)(?=\s|\/|&gt;|$)/g, (_m: string, aName: string) => {
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

  } else if (type === 'groovy') {
    // 1. Comments (including Shebang #!)
    safe = safe.replace(/(#![^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. Groovy Annotations (e.g. @CompileStatic, @ToString)
    safe = safe.replace(/(@[a-zA-Z_]\w*)/g, (match) => {
      return saveToken(`<span class="${colors.annotation}">${match}</span>`);
    });

    // 3. Triple-quoted & Single/Double Quoted Strings (and GString interpolation)
    safe = safe.replace(/("""""[\s\S]*?"""""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\/[^\/\n]+\/)/g, (match) => {
      return saveToken(`<span class="${colors.string}">${match}</span>`);
    });

    // 4. Groovy Keywords & Builtin Extensions
    const groovyKeywords = [
      'def', 'class', 'interface', 'trait', 'enum', 'package', 'import', 'extends', 'implements',
      'public', 'private', 'protected', 'static', 'final', 'synchronized', 'volatile', 'transient',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super', 'instanceof',
      'as', 'in', 'boolean', 'byte', 'char', 'short', 'int', 'long', 'float', 'double',
      'void', 'true', 'false', 'null', 'println', 'print', 'assert', 'each', 'collect',
      'findAll', 'sum', 'find', 'groupBy', 'inject', 'it'
    ];
    const kwRegex = new RegExp(`\\b(${groovyKeywords.join('|')})\\b`, 'g');
    safe = safe.replace(kwRegex, (match) => {
      if (['def', 'println', 'print', 'assert', 'each', 'collect', 'findAll', 'sum', 'find', 'groupBy', 'inject', 'it'].includes(match)) {
        return saveToken(`<span class="${colors.groovyExt}">${match}</span>`);
      }
      return saveToken(`<span class="${colors.keyword}">${match}</span>`);
    });

    // 5. Common Groovy / Java Types
    const groovyTypes = ['String', 'Integer', 'Double', 'Boolean', 'Float', 'Long', 'List', 'Map', 'Set', 'Object', 'Closure', 'GString', 'BigDecimal', 'BigInteger', 'File', 'Date', 'GroovyRuntime'];
    const typeRegex = new RegExp(`\\b(${groovyTypes.join('|')})\\b`, 'g');
    safe = safe.replace(typeRegex, (match) => {
      return saveToken(`<span class="${colors.type}">${match}</span>`);
    });

    // 6. Numbers
    safe = safe.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
      return saveToken(`<span class="${colors.number}">${match}</span>`);
    });

    // 7. Groovy Specific Operators (?:, ?., <=>, *., .., ->, .&, =~, ==~)
    safe = safe.replace(/(\?:\s*|\?\.|&lt;=&gt;|\*\.|\.\.|-&gt;|\.&amp;|=~|==~|=&gt;|&gt;|&lt;|==|!=|&amp;&amp;|\|\|)/g, (match) => {
      return saveToken(`<span class="${colors.operator}">${match}</span>`);
    });

  } else if (type === 'json') {
    // 1. JSON Keys ("key":)
    safe = safe.replace(/("[^"\\]*(?:\\.[^"\\]*)*")\s*:/g, (match, keyName) => {
      return `${saveToken(`<span class="${colors.attrName}">${keyName}</span>`)}:`;
    });

    // 2. JSON Strings
    safe = safe.replace(/("[^"\\]*(?:\\.[^"\\]*)*")/g, (match) => {
      return saveToken(`<span class="${colors.string}">${match}</span>`);
    });

    // 3. Numbers
    safe = safe.replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, (match) => {
      return saveToken(`<span class="${colors.number}">${match}</span>`);
    });

    // 4. Booleans and null
    safe = safe.replace(/\b(true|false|null)\b/g, (match) => {
      return saveToken(`<span class="${colors.keyword}">${match}</span>`);
    });

  } else if (type === 'txt') {
    // 1. Comments starting with # or //
    safe = safe.replace(/(#[^\n]*|\/\/[^\n]*)/g, (match) => {
      return saveToken(`<span class="${colors.comment}">${match}</span>`);
    });

    // 2. Directives, Keys, and Parameters (User-agent:, Contact:, Allow:, Disallow:, contact=, vendor=, etc.)
    safe = safe.replace(/\b([a-zA-Z0-9_\-]+:|=)/g, (match) => {
      return saveToken(`<span class="${colors.attrName}">${match}</span>`);
    });

    // 3. URLs
    safe = safe.replace(/(https?:\/\/[^\s]+)/gi, (match) => {
      return saveToken(`<span class="${colors.string}">${match}</span>`);
    });

    // 4. Emails
    safe = safe.replace(/(mailto:[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, (match) => {
      return saveToken(`<span class="${colors.type}">${match}</span>`);
    });

  } else {
    // JS & TS

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
