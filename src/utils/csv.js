/** @param {string} line @param {string} delimiter */
export function parseCsvLine(line, delimiter = ',') {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === delimiter) {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

/** @param {string} text @param {string} delimiter */
export function parseCsv(text, delimiter = ',') {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
  return lines.map((line) => parseCsvLine(line, delimiter))
}

/** @param {unknown} cell @param {string} delimiter */
function escapeCsvCell(cell, delimiter) {
  const s = cell === null || cell === undefined ? '' : String(cell)
  if (s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delimiter)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/** @param {string[][]} rows @param {string} delimiter */
export function rowsToCsv(rows, delimiter = ',') {
  return rows.map((row) => row.map((c) => escapeCsvCell(c, delimiter)).join(delimiter)).join('\n')
}

/** @param {string[][]} rows */
export function formatCsvPretty(rows) {
  if (!rows.length) return ''
  const colCount = Math.max(...rows.map((r) => r.length))
  const widths = Array.from({ length: colCount }, () => 0)
  for (const row of rows) {
    for (let c = 0; c < row.length; c++) {
      widths[c] = Math.max(widths[c], String(row[c] ?? '').length)
    }
  }
  return rows
    .map((row) =>
      Array.from({ length: colCount }, (_, i) => String(row[i] ?? '').padEnd(widths[i])).join('  '),
    )
    .join('\n')
}

/** @param {string[][]} rows — first row treated as headers */
export function csvRowsToObjects(rows) {
  if (!rows.length) return []
  const headers = rows[0].map((h) => String(h).trim())
  return rows.slice(1).map((cells) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? ''
    })
    return obj
  })
}
