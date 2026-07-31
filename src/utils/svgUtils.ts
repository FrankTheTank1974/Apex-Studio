export function normalizeSvgContent(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // 1. If it's already raw <svg> XML markup
  if (trimmed.startsWith('<svg') || (trimmed.startsWith('<?xml') && trimmed.includes('<svg'))) {
    return trimmed;
  }

  // Helper to check if decoded text is valid SVG markup
  const extractSvgFromText = (text: string): string | null => {
    const cleanText = text.trim();
    if (cleanText.startsWith('<svg')) return cleanText;
    const svgMatch = cleanText.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) return svgMatch[0];
    return null;
  };

  // Helper to attempt base64 decode
  const tryDecodeBase64 = (b64: string): string | null => {
    try {
      // Standard UTF-8 base64 decode
      const decoded = decodeURIComponent(
        Array.from(atob(b64))
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const svg = extractSvgFromText(decoded);
      if (svg) return svg;
    } catch {}

    try {
      const decoded = atob(b64);
      const svg = extractSvgFromText(decoded);
      if (svg) return svg;
    } catch {}

    return null;
  };

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
      const svg = extractSvgFromText(decoded);
      if (svg) return svg;
    } catch {}
    return `<img src="${trimmed}" alt="Draw.io Diagram" class="max-w-full h-auto mx-auto block" />`;
  }

  // 4. If it's a raw Base64 string (without data: header)
  const decodedFromRawB64 = tryDecodeBase64(trimmed);
  if (decodedFromRawB64) return decodedFromRawB64;

  // 5. Fallback for raw Base64 or Data URIs -> render as <img> tag
  if (!trimmed.includes('<') && trimmed.length > 20) {
    const dataUrl = trimmed.startsWith('data:') ? trimmed : `data:image/svg+xml;base64,${trimmed}`;
    return `<img src="${dataUrl}" alt="Draw.io Diagram" class="max-w-full h-auto mx-auto block" />`;
  }

  return trimmed;
}
