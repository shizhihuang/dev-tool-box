/** Escape for safe HTML text / attribute contexts (basic set). */
export function escapeHtmlEntities(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Decode common named + numeric entities (browser-assisted).
 * @param {string} str
 */
export function unescapeHtmlEntities(str) {
  const t = document.createElement('textarea')
  t.innerHTML = str
  return t.value
}
