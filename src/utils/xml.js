/** @param {string} str */
export function parseXml(str) {
  const doc = new DOMParser().parseFromString(str, 'application/xml')
  const err = doc.querySelector('parsererror')
  if (err) {
    const msg = err.textContent?.trim() || 'Invalid XML'
    throw new Error(msg)
  }
  return doc
}

function escapeXmlText(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeXmlAttr(s) {
  return escapeXmlText(s).replace(/"/g, '&quot;')
}

/**
 * Pretty-print XML (element tree only; parser normalizes some whitespace).
 * @param {string} str
 * @param {string} tab
 */
export function formatXmlString(str, tab = '  ') {
  const doc = parseXml(str)
  return serializeElement(doc.documentElement, 0, tab).trimEnd() + '\n'
}

/**
 * @param {Element} node
 * @param {number} depth
 * @param {string} tab
 */
function serializeElement(node, depth, tab) {
  const pad = tab.repeat(depth)
  const name = node.tagName
  const attrs = [...node.attributes].map((a) => ` ${a.name}="${escapeXmlAttr(a.value)}"`).join('')
  const rawKids = [...node.childNodes].filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE ||
      (n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim()),
  )
  if (rawKids.length === 0) {
    return `${pad}<${name}${attrs}/>\n`
  }
  const onlyOneText = rawKids.length === 1 && rawKids[0].nodeType === Node.TEXT_NODE
  if (onlyOneText) {
    const text = escapeXmlText(rawKids[0].textContent)
    return `${pad}<${name}${attrs}>${text}</${name}>\n`
  }
  const inner = rawKids
    .map((k) => {
      if (k.nodeType === Node.TEXT_NODE) {
        return `${pad}${tab}${escapeXmlText(k.textContent.trim())}\n`
      }
      return serializeElement(k, depth + 1, tab)
    })
    .join('')
  return `${pad}<${name}${attrs}>\n${inner}${pad}</${name}>\n`
}

/** Minify: strip insignificant whitespace between tags (best-effort). */
export function minifyXmlString(str) {
  const doc = parseXml(str)
  const s = new XMLSerializer().serializeToString(doc.documentElement)
  return s.replace(/>\s+</g, '><')
}

/**
 * @param {Element} el
 * @returns {unknown}
 */
function elementToJson(el) {
  const attrs = {}
  for (const a of el.attributes) {
    attrs[`@${a.name}`] = a.value
  }
  const childEls = [...el.children]
  const textJoined = [...el.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join('')
  const textTrim = textJoined.trim()

  if (childEls.length === 0) {
    if (Object.keys(attrs).length === 0) return textTrim || ''
    return textTrim ? { ...attrs, '#text': textTrim } : { ...attrs }
  }

  const byTag = {}
  for (const c of childEls) {
    const tag = c.tagName
    const v = elementToJson(c)
    if (byTag[tag] === undefined) {
      byTag[tag] = v
    } else if (Array.isArray(byTag[tag])) {
      byTag[tag].push(v)
    } else {
      byTag[tag] = [byTag[tag], v]
    }
  }
  const out = { ...attrs, ...byTag }
  if (textTrim) {
    out['#text'] = textTrim
  }
  return out
}

/**
 * Root element becomes a single key wrapping its JSON value.
 * @param {string} str
 */
export function xmlToJson(str) {
  const doc = parseXml(str)
  const root = doc.documentElement
  return { [root.tagName]: elementToJson(root) }
}
