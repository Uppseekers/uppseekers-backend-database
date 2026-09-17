/**
 * Cleans up common UTF-8 / Windows-1252 character decoding artifacts
 * from Google Sheet and CSV data exports.
 */
export function cleanText(input: string | undefined | null): string {
  if (!input) return '';

  let text = String(input);

  // Common mojibake replacements
  const replacements: [RegExp, string][] = [
    [/‚Äî/g, ' — '],
    [/‚Äì/g, ' – '],
    [/‚Ä¢/g, '• '],
    [/‚Äô/g, "'"],
    [/‚Äú/g, '"'],
    [/‚Äù/g, '"'],
    [/‚Ñ¢/g, '™'],
    [/¬∑/g, '·'],
    [/¬Æ/g, '®'],
    [/√©/g, 'é'],
    [/√°/g, 'á'],
    [/√±/g, 'ñ'],
    [/√≥/g, 'ó'],
    [/√∂/g, 'ö'],
    [/√§/g, 'ä'],
    [/√º/g, 'ü'],
    [/√í/g, 'Ó'],
    [/2√ó/g, '2×'],
    [/3√ó/g, '3×'],
    [/4√ó/g, '4×'],
    [/5√ó/g, '5×'],
    [/√ó/g, '×'],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  // Remove multiple trailing spaces per line and normalize line breaks
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

export const NOT_ADDED_TEXT = 'not added by student';

/**
 * Checks whether a text value is absent, empty, or essentially missing.
 */
export function isFieldMissing(val: string | undefined | null): boolean {
  if (!val) return true;
  const cleaned = cleanText(val).trim().toLowerCase();
  return (
    cleaned === '' ||
    cleaned === 'none' ||
    cleaned === 'n/a' ||
    cleaned === 'na' ||
    cleaned === '—' ||
    cleaned === '-' ||
    cleaned === 'nil' ||
    cleaned === 'null' ||
    cleaned === 'undefined'
  );
}

/**
 * Returns the cleaned string or 'not added by student' if unavailable.
 */
export function getFieldOrNotAdded(val: string | undefined | null): string {
  if (isFieldMissing(val)) {
    return NOT_ADDED_TEXT;
  }
  return cleanText(val);
}

/**
 * Splits lines and items into bullet list array for clean rendering in cards and modals
 */
export function parseBulletItems(text: string): string[] {
  if (!text) return [];
  const cleaned = cleanText(text);
  
  // Split by newlines or bullet symbols
  const lines = cleaned
    .split(/\n+/)
    .map(line => line.replace(/^[•\-\*\s]+/, '').trim())
    .filter(line => line.length > 0);

  return lines;
}
