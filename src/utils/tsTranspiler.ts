import * as Babel from '@babel/standalone';

export interface TranspileResult {
  code: string;
  error?: string;
}

/**
 * Transpiles TypeScript code into standard browser-compatible JavaScript using Babel Standalone.
 */
export function transpileTypeScript(tsCode: string): TranspileResult {
  if (!tsCode || !tsCode.trim()) {
    return { code: '' };
  }

  try {
    const result = Babel.transform(tsCode, {
      presets: ['typescript'],
      filename: 'script.ts',
      retainLines: true,
    });

    return {
      code: result.code || '',
    };
  } catch (err: any) {
    console.warn('TypeScript transpilation warning, falling back:', err?.message || err);
    // Fallback lightweight regex TS type stripper if Babel encounters standalone edge case
    try {
      const stripped = stripTypesRegex(tsCode);
      return { code: stripped, error: err?.message };
    } catch (fallbackErr: any) {
      return { code: tsCode, error: err?.message || String(err) };
    }
  }
}

/**
 * Lightweight regex fallback to strip common TS annotations
 */
function stripTypesRegex(code: string): string {
  return code
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '') // strip interfaces
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, '') // strip type aliases
    .replace(/:\s*(string|number|boolean|any|void|unknown|object|never|Record<[^>]+>|Array<[^>]+>|\w+\[\]|\w+)\b/g, '') // strip simple type annotations
    .replace(/\bas\s+(string|number|boolean|any|unknown|object|\w+)\b/g, ''); // strip 'as' casts
}
