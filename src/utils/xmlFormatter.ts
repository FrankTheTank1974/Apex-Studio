/**
 * XML Auto-Indentation & Pretty-Printing Utility
 * Formats raw XML into clean, structured, indented markup.
 * Properly handles XML declarations, comments, CDATA, self-closing tags,
 * and inline element content.
 */

export function formatXml(xml: string, indentSize: number = 2): string {
  if (!xml || !xml.trim()) return xml;

  const indentStr = ' '.repeat(indentSize);
  let formatted = '';
  let indentLevel = 0;

  // Normalize line endings and trim outer whitespace
  const sanitized = xml.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // Pattern matches:
  // 1. Comments: <!-- ... -->
  // 2. CDATA: <![CDATA[ ... ]]>
  // 3. Processing Instructions / DOCTYPE: <?...?> or <!DOCTYPE ...>
  // 4. Closing tags: </name>
  // 5. Self-closing tags: <name ... />
  // 6. Opening tags: <name ...>
  // 7. Text content between tags
  const tokenRegex = /(<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<\/[a-zA-Z0-9_\-:]+\s*>|<[a-zA-Z0-9_\-:]+(?:\s+[a-zA-Z0-9_\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))*\s*\/>|<[a-zA-Z0-9_\-:]+(?:\s+[a-zA-Z0-9_\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))*\s*>|[^<]+)/gi;

  const rawTokens = sanitized.match(tokenRegex) || [];
  
  // Clean up whitespace-only tokens between tags
  const tokens: string[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    if (token.startsWith('<')) {
      tokens.push(token);
    } else {
      const trimmedText = token.trim();
      if (trimmedText.length > 0) {
        tokens.push(trimmedText);
      }
    }
  }

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    // Case 1: Inline tag with text content e.g., <title>ApexStudio Engine</title>
    if (
      token.startsWith('<') &&
      !token.startsWith('</') &&
      !token.endsWith('/>') &&
      !token.startsWith('<?') &&
      !token.startsWith('<!--') &&
      !token.startsWith('<![CDATA[') &&
      !token.startsWith('<!DOCTYPE') &&
      i + 2 < tokens.length &&
      !tokens[i + 1].startsWith('<') && // middle is text
      tokens[i + 2].startsWith('</') // next is closing tag
    ) {
      const openingTag = token;
      const textContent = tokens[i + 1];
      const closingTag = tokens[i + 2];

      const openingTagName = openingTag.match(/<([a-zA-Z0-9_\-:]+)/)?.[1];
      const closingTagName = closingTag.match(/<\/([a-zA-Z0-9_\-:]+)/)?.[1];

      if (openingTagName && closingTagName && openingTagName === closingTagName) {
        formatted += `${indentStr.repeat(indentLevel)}${openingTag}${textContent}${closingTag}\n`;
        i += 3;
        continue;
      }
    }

    // Case 2: Closing tag </name>
    if (token.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += `${indentStr.repeat(indentLevel)}${token}\n`;
      i++;
      continue;
    }

    // Case 3: Self-closing tag <name ... /> or Processing Instruction <?...?> or DOCTYPE or Comment or CDATA
    if (
      token.endsWith('/>') ||
      token.startsWith('<?') ||
      token.startsWith('<!--') ||
      token.startsWith('<![CDATA[') ||
      token.startsWith('<!DOCTYPE')
    ) {
      formatted += `${indentStr.repeat(indentLevel)}${token}\n`;
      i++;
      continue;
    }

    // Case 4: Opening tag <name ...>
    if (token.startsWith('<')) {
      formatted += `${indentStr.repeat(indentLevel)}${token}\n`;
      indentLevel++;
      i++;
      continue;
    }

    // Case 5: Text node on its own line
    formatted += `${indentStr.repeat(indentLevel)}${token}\n`;
    i++;
  }

  return formatted.trim();
}
