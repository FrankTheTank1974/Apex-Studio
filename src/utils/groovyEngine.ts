/**
 * GroovyScript Execution and Transpilation Engine for Browser Runtime
 */

export interface GroovyExecutionResult {
  output: string[];
  result: any;
  error?: string;
  executionTimeMs: number;
  transpiledJs: string;
}

/**
 * Transpiles GroovyScript code to valid JavaScript
 */
export function transpileGroovyToJS(groovyCode: string): string {
  if (!groovyCode || !groovyCode.trim()) return '';

  let js = groovyCode;

  // 1. Convert Groovy 'def ' declarations to 'let '
  js = js.replace(/\bdef\s+/g, 'let ');

  // 2. Convert Groovy string interpolation "$var" -> "${var}" for GStrings
  js = js.replace(/"([^"]*)"/g, (match, inner) => {
    // Replace $identifier (not already in ${...}) with ${identifier}
    const fixedInner = inner.replace(/\$([a-zA-Z_]\w*)/g, '${$1}');
    return '`' + fixedInner + '`';
  });

  // 3. Convert Groovy Map literals [key: val, key2: val2] to JS objects {key: val, key2: val2}
  // Match [ word: ... ] pattern
  js = js.replace(/\[\s*([a-zA-Z_]\w*)\s*:/g, '{$1:');

  // 4. Convert Groovy Elvis operator `a ?: b` -> `(a !== null && a !== undefined ? a : b)`
  js = js.replace(/([a-zA-Z0-9_\.()]+)\s*\?:\s*([^;\n]+)/g, '(($1) !== null && ($1) !== undefined ? ($1) : ($2))');

  // 5. Convert Groovy range syntax `(1..5)` or `1..5` -> `GroovyRuntime.range(1, 5)`
  js = js.replace(/\(?(\d+)\.\.(\d+)\)?/g, 'GroovyRuntime.range($1, $2)');

  // 6. Convert Groovy 'println' and 'print' calls to 'GroovyRuntime.println'
  js = js.replace(/\bprintln\s*\(/g, 'GroovyRuntime.println(');
  js = js.replace(/\bprintln\s+([^;\n]+)/g, 'GroovyRuntime.println($1)');
  js = js.replace(/\bprint\s*\(/g, 'GroovyRuntime.print(');

  // 7. Convert Groovy 'assert condition' -> 'GroovyRuntime.assert(condition)'
  js = js.replace(/\bassert\s+([^;\n]+)/g, 'GroovyRuntime.assert($1)');

  // 8. Convert Groovy closure syntax `{ item -> ... }` to `(item) => { ... }` or `{ ... }` to `(it) => { ... }`
  js = convertGroovyClosures(js);

  return js;
}

/**
 * Converts Groovy closures in JS code string
 */
function convertGroovyClosures(code: string): string {
  // Convert { param -> body } -> (param) => { body }
  code = code.replace(/\{\s*([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*->/g, '($1) => {');

  // Convert Groovy closure shorthand .each { ... } to .each((it) => { ... })
  // where 'it' is implicit argument if no -> is supplied
  code = code.replace(/\.(each|collect|findAll|find|groupBy)\s*\{/g, '.$1((it) => {');

  return code;
}

/**
 * Groovy Helper Runtime for array methods, ranges, and console outputs
 */
export const GroovyRuntime = {
  logs: [] as string[],

  clearLogs() {
    this.logs = [];
  },

  println(...args: any[]) {
    const formatted = args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ');
    this.logs.push(formatted);
    console.log('[Groovy Output]:', ...args);
  },

  print(...args: any[]) {
    const formatted = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    if (this.logs.length > 0) {
      this.logs[this.logs.length - 1] += formatted;
    } else {
      this.logs.push(formatted);
    }
  },

  assert(condition: boolean, message?: string) {
    if (!condition) {
      throw new Error(`Groovy Assertion Failed: ${message || 'Condition evaluated to false'}`);
    }
  },

  range(start: number, end: number): number[] {
    const res: number[] = [];
    if (start <= end) {
      for (let i = start; i <= end; i++) res.push(i);
    } else {
      for (let i = start; i >= end; i--) res.push(i);
    }
    return res;
  },

  // Helper extension wrapper for arrays
  enhanceArray(arr: any[]) {
    if (!arr) return arr;
    
    // Add Groovy methods to array instance if missing
    if (!('each' in arr)) {
      Object.defineProperty(arr, 'each', {
        value: function (fn: (item: any, index: number) => void) {
          this.forEach((item: any, i: number) => fn(item, i));
          return this;
        },
        configurable: true,
        writable: true,
      });
    }

    if (!('collect' in arr)) {
      Object.defineProperty(arr, 'collect', {
        value: function (fn: (item: any) => any) {
          return this.map((item: any) => fn(item));
        },
        configurable: true,
        writable: true,
      });
    }

    if (!('findAll' in arr)) {
      Object.defineProperty(arr, 'findAll', {
        value: function (fn: (item: any) => boolean) {
          return this.filter((item: any) => fn(item));
        },
        configurable: true,
        writable: true,
      });
    }

    if (!('sum' in arr)) {
      Object.defineProperty(arr, 'sum', {
        value: function () {
          return this.reduce((a: number, b: number) => a + b, 0);
        },
        configurable: true,
        writable: true,
      });
    }

    return arr;
  }
};

/**
 * Runs GroovyScript code safely inside browser environment
 */
export function runGroovyScript(groovyCode: string): GroovyExecutionResult {
  const startTime = performance.now();
  GroovyRuntime.clearLogs();

  const transpiledJs = transpileGroovyToJS(groovyCode);

  try {
    // Inject GroovyRuntime into function evaluation context
    const runFn = new Function('GroovyRuntime', `
      "use strict";

      // Polyfill Array prototypes for Groovy-like methods
      if (!Array.prototype.each) {
        Array.prototype.each = function(fn) {
          this.forEach((item, index) => fn(item, index));
          return this;
        };
      }
      if (!Array.prototype.collect) {
        Array.prototype.collect = function(fn) {
          return this.map(fn);
        };
      }
      if (!Array.prototype.findAll) {
        Array.prototype.findAll = function(fn) {
          return this.filter(fn);
        };
      }
      if (!Array.prototype.sum) {
        Array.prototype.sum = function() {
          return this.reduce((a, b) => a + b, 0);
        };
      }

      ${transpiledJs}
    `);

    const result = runFn(GroovyRuntime);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      output: [...GroovyRuntime.logs],
      result,
      executionTimeMs,
      transpiledJs,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      output: [...GroovyRuntime.logs],
      result: undefined,
      error: err?.message || String(err),
      executionTimeMs,
      transpiledJs,
    };
  }
}
