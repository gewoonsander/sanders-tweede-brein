// Minimal YAML frontmatter parser for task files
// No dependencies; handles scalar values, arrays, nulls, and quoted strings

export function parseTaskFrontmatter(text) {
  if (!text) return { fm: {}, body: '' };

  const lines = text.split('\n');
  if (!lines[0].trim().startsWith('---')) {
    return { fm: {}, body: text };
  }

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('---')) {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) {
    return { fm: {}, body: text };
  }

  const fmLines = lines.slice(1, endIdx);
  const body = lines.slice(endIdx + 1).join('\n');
  const fm = {};

  for (const line of fmLines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.substring(0, colonIdx).trim();
    let value = trimmed.substring(colonIdx + 1).trim();

    // null keyword
    if (value === 'null' || value === '') {
      fm[key] = null;
      continue;
    }

    // Array: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      const content = value.substring(1, value.length - 1);
      if (content.trim() === '') {
        fm[key] = [];
      } else {
        fm[key] = content.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
      }
      continue;
    }

    // Quoted string: strip quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      fm[key] = value.substring(1, value.length - 1);
      continue;
    }

    // Scalar (number or bare string)
    const asNum = Number(value);
    if (!isNaN(asNum) && value !== '') {
      fm[key] = asNum;
    } else {
      fm[key] = value;
    }
  }

  return { fm, body };
}
