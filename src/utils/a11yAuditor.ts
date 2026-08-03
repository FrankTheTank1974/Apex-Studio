/**
 * Accessibility (a11y) Auditor Engine - WCAG 2.1 AA Compliance Checker
 * Analyzes HTML structure, heading hierarchy, image attributes, color contrast,
 * form labels, and ARIA roles with automated quick-fix generators.
 */

export interface A11yIssue {
  id: string;
  rule:
    | 'missing-alt'
    | 'empty-alt-decorative'
    | 'skipped-heading'
    | 'missing-h1'
    | 'multiple-h1'
    | 'empty-heading'
    | 'low-contrast'
    | 'input-missing-label'
    | 'button-missing-label'
    | 'link-missing-label'
    | 'link-target-blank-rel'
    | 'html-missing-lang'
    | 'missing-main-landmark'
    | 'duplicate-id'
    | 'invalid-aria';
  category: 'Images & Media' | 'Headings & Hierarchy' | 'Color & Contrast' | 'Forms & Controls' | 'Document & ARIA';
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  wcagRule: string; // e.g. "WCAG 2.1 AA (1.1.1 Non-text Content)"
  line: number;
  snippet: string;
  tagName?: string;
  suggestion: string;
  fixable: boolean;
  fixActionName?: string;
}

export interface A11yAuditReport {
  score: number; // 0 - 100
  totalChecks: number;
  passedCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  issues: A11yIssue[];
}

/**
 * Helper to calculate WCAG 2.1 relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Helper to parse hex/rgb color strings to [r,g,b]
 */
function parseColor(colorStr: string): [number, number, number] | null {
  if (!colorStr) return null;
  const str = colorStr.trim().toLowerCase();

  // Hex format #fff or #ffffff
  if (str.startsWith('#')) {
    const hex = str.substring(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length === 6 || hex.length === 8) {
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
      ];
    }
  }

  // RGB format rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }

  // Named common colors fallback
  const namedColors: Record<string, [number, number, number]> = {
    white: [255, 255, 255],
    black: [0, 0, 0],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    gray: [128, 128, 128],
    lightgray: [211, 211, 211],
    darkgray: [169, 169, 169],
    slate: [100, 116, 139],
  };

  if (namedColors[str]) {
    return namedColors[str];
  }

  return null;
}

/**
 * Calculate Contrast Ratio between two colors
 */
export function calculateContrastRatio(fg: string, bg: string): number | null {
  const fgRgb = parseColor(fg);
  const bgRgb = parseColor(bg);

  if (!fgRgb || !bgRgb) return null;

  const l1 = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
  const l2 = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Main Accessibility Auditor Function
 */
export function auditHtmlAccessibility(htmlContent: string): A11yAuditReport {
  const issues: A11yIssue[] = [];
  if (!htmlContent || typeof htmlContent !== 'string') {
    return {
      score: 100,
      totalChecks: 0,
      passedCount: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      issues: [],
    };
  }

  const lines = htmlContent.split('\n');
  let totalRuleChecksExecuted = 0;

  // 1. Check Document-Level Structure (lang attribute, title, main landmark)
  totalRuleChecksExecuted += 4;
  const lowerHtml = htmlContent.toLowerCase();

  // HTML Lang attribute check
  const htmlTagMatch = htmlContent.match(/<html\b([^>]*?)>/i);
  if (htmlTagMatch) {
    const attrs = htmlTagMatch[1] || '';
    if (!/\blang\s*=\s*["'][a-z0-9_-]+["']/i.test(attrs)) {
      issues.push({
        id: 'a11y-html-lang-missing',
        rule: 'html-missing-lang',
        category: 'Document & ARIA',
        severity: 'error',
        title: 'Missing "lang" attribute on <html> element',
        message: 'The <html> root tag should specify a language attribute (e.g. lang="en") so screen readers choose the correct voice synthesis.',
        wcagRule: 'WCAG 2.1 AA (3.1.1 Language of Page)',
        line: 1,
        snippet: htmlTagMatch[0],
        suggestion: 'Add lang="en" to the <html> tag.',
        fixable: true,
        fixActionName: 'Add lang="en"',
      });
    }
  }

  // Missing <main> landmark check
  if (lowerHtml.includes('<body') && !lowerHtml.includes('<main') && !lowerHtml.includes('role="main"')) {
    issues.push({
      id: 'a11y-missing-main-landmark',
      rule: 'missing-main-landmark',
      category: 'Document & ARIA',
      severity: 'warning',
      title: 'Missing <main> structural landmark',
      message: 'No <main> tag or role="main" landmark container was found. Screen readers rely on landmarks to skip navigation to primary content.',
      wcagRule: 'WCAG 2.1 AA (1.3.1 Info and Relationships / Landmarks)',
      line: 1,
      snippet: '<body> ... </body>',
      suggestion: 'Wrap primary page content inside a <main> element.',
      fixable: true,
      fixActionName: 'Wrap body content in <main>',
    });
  }

  // 2. Heading Structure Audit (H1-H6)
  totalRuleChecksExecuted += 5;
  const headings: { tag: string; level: number; line: number; text: string; full: string }[] = [];

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;
    let match: RegExpExecArray | null;
    const lineHeadingRegex = /<(h[1-6])\b([^>]*?)>([\s\S]*?)<\/h[1-6]>/gi;

    while ((match = lineHeadingRegex.exec(lineText)) !== null) {
      const tag = match[1].toLowerCase();
      const level = parseInt(tag.substring(1), 10);
      const text = match[3].replace(/<[^>]*>/g, '').trim();

      headings.push({
        tag,
        level,
        line: lineNum,
        text,
        full: match[0],
      });

      // Check empty heading
      if (!text) {
        issues.push({
          id: `a11y-empty-heading-${lineNum}`,
          rule: 'empty-heading',
          category: 'Headings & Hierarchy',
          severity: 'error',
          title: `Empty heading element <${tag}>`,
          message: `Heading <${tag}> contains no accessible text content or text nodes.`,
          wcagRule: 'WCAG 2.1 AA (1.3.1 Info and Relationships)',
          line: lineNum,
          snippet: match[0],
          tagName: tag,
          suggestion: `Provide descriptive text inside <${tag}> or remove it if unused.`,
          fixable: true,
          fixActionName: 'Add placeholder text',
        });
      }
    }
  });

  // Check H1 Count & Hierarchy
  const h1Headings = headings.filter((h) => h.level === 1);
  if (headings.length > 0 && h1Headings.length === 0) {
    issues.push({
      id: 'a11y-missing-h1',
      rule: 'missing-h1',
      category: 'Headings & Hierarchy',
      severity: 'warning',
      title: 'Missing top-level <h1> page heading',
      message: 'No <h1> heading was found on the page. Each page should have a primary <h1> heading summarizing its topic.',
      wcagRule: 'WCAG 2.1 AA (2.4.6 Headings and Labels)',
      line: headings[0]?.line || 1,
      snippet: headings[0]?.full || '<html>',
      suggestion: 'Promote the main section heading to an <h1> element.',
      fixable: true,
      fixActionName: 'Convert first heading to <h1>',
    });
  } else if (h1Headings.length > 1) {
    h1Headings.slice(1).forEach((h) => {
      issues.push({
        id: `a11y-multiple-h1-${h.line}`,
        rule: 'multiple-h1',
        category: 'Headings & Hierarchy',
        severity: 'info',
        title: 'Multiple <h1> headings detected',
        message: 'Multiple <h1> elements exist. While valid in HTML5, having a single primary <h1> per document improves screen reader navigation clarity.',
        wcagRule: 'WCAG 2.1 AA (1.3.1 Info and Relationships)',
        line: h.line,
        snippet: h.full,
        tagName: 'h1',
        suggestion: 'Demote secondary <h1> headings to <h2>.',
        fixable: true,
        fixActionName: 'Change to <h2>',
      });
    });
  }

  // Check Skipped Heading Levels (e.g. H1 -> H3)
  for (let i = 0; i < headings.length - 1; i++) {
    const current = headings[i];
    const next = headings[i + 1];
    if (next.level > current.level + 1) {
      issues.push({
        id: `a11y-skipped-heading-${next.line}`,
        rule: 'skipped-heading',
        category: 'Headings & Hierarchy',
        severity: 'warning',
        title: `Skipped heading level: <${current.tag}> to <${next.tag}>`,
        message: `Heading hierarchy skips levels from <${current.tag}> directly to <${next.tag}> on line ${next.line}. Headings should decrease by 1 level sequentially for clear document structure.`,
        wcagRule: 'WCAG 2.1 AA (1.3.1 Info and Relationships / Heading Order)',
        line: next.line,
        snippet: next.full,
        tagName: next.tag,
        suggestion: `Change <${next.tag}> to <h${current.level + 1}> to preserve logical hierarchy.`,
        fixable: true,
        fixActionName: `Change to <h${current.level + 1}>`,
      });
    }
  }

  // 3. Image Alt Text & Media Inspection
  totalRuleChecksExecuted += 6;

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;
    let match: RegExpExecArray | null;
    const lineImgRegex = /<img\b([^>]*?)\/?>/gi;

    while ((match = lineImgRegex.exec(lineText)) !== null) {
      const fullTag = match[0];
      const attrs = match[1] || '';

      const hasAltAttr = /\balt\s*=/i.test(attrs);
      const altMatch = attrs.match(/\balt\s*=\s*["']([^"']*)["']/i);
      const altValue = altMatch ? altMatch[1].trim() : null;

      if (!hasAltAttr) {
        issues.push({
          id: `a11y-missing-alt-${lineNum}-${match.index}`,
          rule: 'missing-alt',
          category: 'Images & Media',
          severity: 'error',
          title: 'Image <img> tag is missing an "alt" attribute',
          message: 'Screen readers cannot describe this image because it lacks an alt attribute.',
          wcagRule: 'WCAG 2.1 AA (1.1.1 Non-text Content)',
          line: lineNum,
          snippet: fullTag,
          tagName: 'img',
          suggestion: 'Add alt="Descriptive image summary" or alt="" if decorative.',
          fixable: true,
          fixActionName: 'Add alt attribute',
        });
      } else if (altValue === '') {
        const isRoleDecorative = /\brole\s*=\s*["'](presentation|none)["']/i.test(attrs);
        if (!isRoleDecorative) {
          issues.push({
            id: `a11y-empty-alt-${lineNum}-${match.index}`,
            rule: 'empty-alt-decorative',
            category: 'Images & Media',
            severity: 'info',
            title: 'Image <img> has empty alt="" attribute',
            message: 'An empty alt="" indicates this image is decorative and will be ignored by assistive technologies.',
            wcagRule: 'WCAG 2.1 AA (1.1.1 Non-text Content / Decorative Images)',
            line: lineNum,
            snippet: fullTag,
            tagName: 'img',
            suggestion: 'Verify if image is purely decorative or add role="presentation" or descriptive alt.',
            fixable: true,
            fixActionName: 'Add role="presentation"',
          });
        }
      }
    }
  });

  // 4. Form Controls & Interactive Buttons
  totalRuleChecksExecuted += 8;
  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Check <input>, <select>, <textarea> labels
    const formControlRegex = /<(input|textarea|select)\b([^>]*?)\/?>/gi;
    let match: RegExpExecArray | null;

    while ((match = formControlRegex.exec(lineText)) !== null) {
      const fullTag = match[0];
      const tag = match[1].toLowerCase();
      const attrs = match[2] || '';

      const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
      const inputType = typeMatch ? typeMatch[1].toLowerCase() : 'text';
      if (['hidden', 'submit', 'button', 'image', 'reset'].includes(inputType)) continue;

      const hasId = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
      const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(attrs);
      const hasAriaLabelledBy = /\baria-labelledby\s*=\s*["'][^"']+["']/i.test(attrs);
      const hasPlaceholder = attrs.match(/\bplaceholder\s*=\s*["']([^"']+)["']/i);

      let hasExplicitLabel = false;
      if (hasId && hasId[1]) {
        const idVal = hasId[1];
        hasExplicitLabel = new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*["']${idVal}["']`, 'i').test(htmlContent);
      }

      if (!hasAriaLabel && !hasAriaLabelledBy && !hasExplicitLabel) {
        issues.push({
          id: `a11y-input-label-${lineNum}-${match.index}`,
          rule: 'input-missing-label',
          category: 'Forms & Controls',
          severity: 'error',
          title: `Form control <${tag}> missing associated label`,
          message: `Form control <${tag}> lacks a connected <label for="..."> or aria-label attribute.`,
          wcagRule: 'WCAG 2.1 AA (1.3.1 Info & Relationships / 4.1.2 Name, Role, Value)',
          line: lineNum,
          snippet: fullTag,
          tagName: tag,
          suggestion: hasPlaceholder
            ? `Add aria-label="${hasPlaceholder[1]}" or a <label> tag.`
            : 'Add aria-label="Descriptive Field Name" attribute.',
          fixable: true,
          fixActionName: 'Add aria-label',
        });
      }
    }

    // Check <button> accessible text / aria-label
    const buttonRegex = /<button\b([^>]*?)>([\s\S]*?)<\/button>/gi;
    while ((match = buttonRegex.exec(lineText)) !== null) {
      const fullTag = match[0];
      const attrs = match[1] || '';
      const innerContent = match[2] || '';
      const cleanText = innerContent.replace(/<[^>]*>/g, '').trim();

      const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(attrs);
      const hasTitle = /\btitle\s*=\s*["'][^"']+["']/i.test(attrs);

      if (!cleanText && !hasAriaLabel && !hasTitle) {
        issues.push({
          id: `a11y-button-label-${lineNum}-${match.index}`,
          rule: 'button-missing-label',
          category: 'Forms & Controls',
          severity: 'error',
          title: 'Interactive <button> has no text content or aria-label',
          message: 'Button contains only icons/SVG with no readable text or aria-label attribute.',
          wcagRule: 'WCAG 2.1 AA (4.1.2 Name, Role, Value)',
          line: lineNum,
          snippet: fullTag,
          tagName: 'button',
          suggestion: 'Add aria-label="Action Description" or visible button text.',
          fixable: true,
          fixActionName: 'Add aria-label',
        });
      }
    }

    // Check Links <a> opening target="_blank" missing rel="noopener noreferrer"
    const linkBlankRegex = /<a\b([^>]*?\btarget\s*=\s*["']_blank["'][^>]*?)>/gi;
    while ((match = linkBlankRegex.exec(lineText)) !== null) {
      const fullTag = match[0];
      const attrs = match[1] || '';
      const hasRel = /\brel\s*=\s*["'][^"']*(noopener|noreferrer)[^"']*["']/i.test(attrs);

      if (!hasRel) {
        issues.push({
          id: `a11y-link-target-rel-${lineNum}-${match.index}`,
          rule: 'link-target-blank-rel',
          category: 'Forms & Controls',
          severity: 'warning',
          title: 'Link with target="_blank" missing rel="noopener noreferrer"',
          message: 'Links that open in new browser tabs present security vulnerabilities and accessibility traps without rel="noopener noreferrer".',
          wcagRule: 'WCAG 2.1 AA (2.4.4 Link Purpose / Security Best Practice)',
          line: lineNum,
          snippet: fullTag,
          tagName: 'a',
          suggestion: 'Add rel="noopener noreferrer" to target="_blank" links.',
          fixable: true,
          fixActionName: 'Add rel="noopener noreferrer"',
        });
      }
    }
  });

  // 5. Color Contrast Analysis (Inline Style & Common Low-Contrast Pairs)
  totalRuleChecksExecuted += 6;
  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Check inline styles style="color: #aaa; background-color: #fff;"
    const styleMatch = lineText.match(/style\s*=\s*["']([^"']+)["']/i);
    if (styleMatch) {
      const styleContent = styleMatch[1];
      const colorProp = styleContent.match(/(?:^|;\s*)color\s*:\s*([^;]+)/i);
      const bgProp = styleContent.match(/(?:^|;\s*)background(?:-color)?\s*:\s*([^;]+)/i);

      if (colorProp && bgProp) {
        const fg = colorProp[1].trim();
        const bg = bgProp[1].trim();
        const ratio = calculateContrastRatio(fg, bg);

        if (ratio !== null && ratio < 4.5) {
          issues.push({
            id: `a11y-low-contrast-${lineNum}`,
            rule: 'low-contrast',
            category: 'Color & Contrast',
            severity: 'error',
            title: `Low Color Contrast Ratio (${ratio}:1)`,
            message: `Text color (${fg}) against background (${bg}) fails WCAG 2.1 AA minimum contrast requirement of 4.5:1. Current ratio is ${ratio}:1.`,
            wcagRule: 'WCAG 2.1 AA (1.4.3 Contrast Minimum)',
            line: lineNum,
            snippet: lineText.trim(),
            suggestion: 'Increase text color darkness or background contrast for legibility.',
            fixable: true,
            fixActionName: 'Fix Color Contrast',
          });
        }
      }
    }

    // Check common low-contrast Tailwind classes
    if (/\btext-(gray|slate|zinc|neutral)-300\b/i.test(lineText) && /\bbg-(white|slate-50|slate-100)\b/i.test(lineText)) {
      issues.push({
        id: `a11y-tailwind-contrast-${lineNum}`,
        rule: 'low-contrast',
        category: 'Color & Contrast',
        severity: 'warning',
        title: 'Low contrast Tailwind combination detected',
        message: 'Combining light text classes (text-slate-300) with light backgrounds (bg-white) produces poor contrast.',
        wcagRule: 'WCAG 2.1 AA (1.4.3 Contrast Minimum)',
        line: lineNum,
        snippet: lineText.trim(),
        suggestion: 'Use text-slate-700 or text-slate-900 on light backgrounds.',
        fixable: true,
        fixActionName: 'Update to High-Contrast Class',
      });
    }
  });

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  const deduction = errorCount * 12 + warningCount * 5 + infoCount * 1;
  const calculatedScore = Math.max(0, 100 - deduction);

  const passedCount = Math.max(1, totalRuleChecksExecuted - issues.length);

  return {
    score: calculatedScore,
    totalChecks: totalRuleChecksExecuted,
    passedCount,
    errorCount,
    warningCount,
    infoCount,
    issues,
  };
}

/**
 * Automated Quick Fix Engine for Accessibility Issues
 */
export function applyA11yQuickFix(htmlContent: string, issue: A11yIssue): string {
  if (!htmlContent || !issue) return htmlContent;

  const lines = htmlContent.split('\n');
  const lineIdx = issue.line - 1;

  if (lineIdx < 0 || lineIdx >= lines.length) {
    if (issue.rule === 'html-missing-lang') {
      return htmlContent.replace(/<html\b([^>]*?)>/i, (m, p1) => `<html${p1} lang="en">`);
    }
    if (issue.rule === 'missing-main-landmark') {
      return htmlContent.replace(/<body\b([^>]*?)>([\s\S]*?)<\/body>/i, (m, p1, p2) => `<body${p1}>\n  <main>\n${p2}\n  </main>\n</body>`);
    }
    return htmlContent;
  }

  let lineText = lines[lineIdx];

  switch (issue.rule) {
    case 'html-missing-lang':
      lines[lineIdx] = lineText.replace(/<html\b([^>]*?)>/i, (m, p1) => `<html${p1} lang="en">`);
      return lines.join('\n');

    case 'missing-main-landmark':
      return htmlContent.replace(/<body\b([^>]*?)>([\s\S]*?)<\/body>/i, (m, p1, p2) => `<body${p1}>\n  <main>\n${p2}\n  </main>\n</body>`);

    case 'missing-alt':
      lines[lineIdx] = lineText.replace(/<img\b([^>]*?)\/?>/i, (m, p1) => {
        const srcMatch = p1.match(/src=["']([^"']+)["']/i);
        let altText = 'Image description';
        if (srcMatch && srcMatch[1]) {
          const fileName = srcMatch[1].split('/').pop()?.split('?')[0]?.split('.')[0];
          if (fileName && fileName.length > 2) {
            altText = fileName.replace(/[-_]/g, ' ');
            altText = altText.charAt(0).toUpperCase() + altText.slice(1);
          }
        }
        return `<img${p1} alt="${altText}">`;
      });
      return lines.join('\n');

    case 'empty-alt-decorative':
      lines[lineIdx] = lineText.replace(/<img\b([^>]*?)\/?>/i, (m, p1) => {
        if (!/\brole=/i.test(p1)) {
          return `<img${p1} role="presentation">`;
        }
        return m;
      });
      return lines.join('\n');

    case 'missing-h1':
    case 'multiple-h1':
      if (issue.rule === 'missing-h1') {
        lines[lineIdx] = lineText.replace(/<h[2-6]\b([^>]*?)>([\s\S]*?)<\/h[2-6]>/i, (m, p1, p2) => `<h1${p1}>${p2}</h1>`);
      } else {
        lines[lineIdx] = lineText.replace(/<h1\b([^>]*?)>([\s\S]*?)<\/h1>/i, (m, p1, p2) => `<h2${p1}>${p2}</h2>`);
      }
      return lines.join('\n');

    case 'skipped-heading':
      if (issue.tagName) {
        const level = parseInt(issue.tagName.substring(1), 10);
        const newLevel = Math.max(1, level - 1);
        lines[lineIdx] = lineText.replace(new RegExp(`<${issue.tagName}\\b([^>]*?)>([\\s\\S]*?)<\\/${issue.tagName}>`, 'i'), (m, p1, p2) => `<h${newLevel}${p1}>${p2}</h${newLevel}>`);
      }
      return lines.join('\n');

    case 'empty-heading':
      lines[lineIdx] = lineText.replace(/<(h[1-6])\b([^>]*?)>([\s\S]*?)<\/h[1-6]>/i, (m, tag, p1) => `<${tag}${p1}>Section Title</${tag}>`);
      return lines.join('\n');

    case 'input-missing-label':
      lines[lineIdx] = lineText.replace(/<(input|textarea|select)\b([^>]*?)\/?>/i, (m, tag, p1) => {
        const phMatch = p1.match(/placeholder=["']([^"']+)["']/i);
        const labelText = phMatch ? phMatch[1] : 'Input Field';
        return `<${tag}${p1} aria-label="${labelText}">`;
      });
      return lines.join('\n');

    case 'button-missing-label':
      lines[lineIdx] = lineText.replace(/<button\b([^>]*?)>/i, (m, p1) => `<button${p1} aria-label="Action Button">`);
      return lines.join('\n');

    case 'link-target-blank-rel':
      lines[lineIdx] = lineText.replace(/<a\b([^>]*?\btarget=["']_blank["'][^>]*?)>/i, (m, p1) => {
        if (/\brel=/i.test(p1)) {
          return p1.replace(/rel=["']([^"']*)["']/i, 'rel="$1 noopener noreferrer"');
        }
        return `<a${p1} rel="noopener noreferrer">`;
      });
      return lines.join('\n');

    case 'low-contrast':
      if (lineText.includes('style=')) {
        lines[lineIdx] = lineText.replace(/color\s*:\s*[^;"]+/i, 'color: #0f172a');
      }
      lines[lineIdx] = lines[lineIdx].replace(/\btext-(gray|slate|zinc|neutral)-300\b/gi, 'text-slate-800');
      return lines.join('\n');

    default:
      return htmlContent;
  }
}
