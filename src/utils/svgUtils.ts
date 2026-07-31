export function normalizeSvgContent(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // Helper to extract clean SVG XML markup from raw or decoded text
  const formatSvgText = (text: string): string | null => {
    if (!text) return null;
    const cleanText = text.trim();

    // 1. Search for a complete <svg ... </svg> tag
    const svgMatch = cleanText.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      return svgMatch[0];
    }

    // 2. Search for <svg ... tag even if closing tag was truncated or formatted differently
    const openSvgIdx = cleanText.toLowerCase().indexOf('<svg');
    if (openSvgIdx !== -1) {
      const fromSvg = cleanText.substring(openSvgIdx);
      if (fromSvg.includes('</svg>')) {
        return fromSvg.substring(0, fromSvg.indexOf('</svg>') + 6);
      }
      return fromSvg;
    }

    // 3. If text contains SVG elements (<g>, <path>, <defs>), strip non-HTML prefix and wrap in <svg>
    const firstTagIdx = cleanText.indexOf('<');
    if (firstTagIdx !== -1) {
      const tagOnlyText = cleanText.substring(firstTagIdx);
      if (tagOnlyText.includes('<g') || tagOnlyText.includes('<path') || tagOnlyText.includes('<defs')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" class="w-full h-auto max-w-2xl mx-auto">${tagOnlyText}</svg>`;
      }
    }

    return null;
  };

  // Safe Base64 decoding
  const tryDecodeBase64 = (b64Str: string): string | null => {
    const cleanB64 = b64Str.replace(/\s/g, '');
    try {
      const decodedUtf8 = decodeURIComponent(
        Array.from(atob(cleanB64))
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const svg = formatSvgText(decodedUtf8);
      if (svg) return svg;
    } catch {}

    try {
      const decodedAscii = atob(cleanB64);
      const svg = formatSvgText(decodedAscii);
      if (svg) return svg;
    } catch {}

    return null;
  };

  // 1. If it's already raw <svg> XML markup
  if (trimmed.toLowerCase().includes('<svg')) {
    const formatted = formatSvgText(trimmed);
    if (formatted) return formatted;
  }

  // 2. If it's a base64 Data URI: data:image/svg+xml;base64,...
  if (trimmed.startsWith('data:image/svg+xml;base64,')) {
    const b64 = trimmed.substring('data:image/svg+xml;base64,'.length).trim();
    const decodedSvg = tryDecodeBase64(b64);
    if (decodedSvg) return decodedSvg;
    return `<img src="${trimmed}" alt="Draw.io Diagram" class="max-w-full h-auto mx-auto block" />`;
  }

  // 3. If it's a URL encoded Data URI: data:image/svg+xml,...
  if (trimmed.startsWith('data:image/svg+xml,')) {
    try {
      const decoded = decodeURIComponent(trimmed.substring('data:image/svg+xml,'.length));
      const svg = formatSvgText(decoded);
      if (svg) return svg;
    } catch {}
    return `<img src="${trimmed}" alt="Draw.io Diagram" class="max-w-full h-auto mx-auto block" />`;
  }

  // 4. Try decoding raw Base64 string directly
  const decodedFromRawB64 = tryDecodeBase64(trimmed);
  if (decodedFromRawB64) return decodedFromRawB64;

  // 5. If it looks like base64 or data string (no HTML brackets), wrap in <img> tag so it never shows raw text
  if (!trimmed.includes('<') || /^[A-Za-z0-9+/=]+$/.test(trimmed)) {
    const dataUrl = trimmed.startsWith('data:') ? trimmed : `data:image/svg+xml;base64,${trimmed}`;
    return `<img src="${dataUrl}" alt="Draw.io Diagram" class="max-w-full h-auto mx-auto block" />`;
  }

  return trimmed;
}

export function serializeDocumentOrBody(doc: Document, originalContent: string): string {
  const isFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(originalContent);
  if (isFullDoc) {
    return doc.doctype ? `<!DOCTYPE html>\n${doc.documentElement.outerHTML}` : doc.documentElement.outerHTML;
  }
  return doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;
}

export function extractCanvasBodyHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  if (doc.body) {
    return doc.body.innerHTML;
  }
  return rawHtml;
}
