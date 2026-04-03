const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

/**
 * @param {string} str
 * @param {number} base 2-36
 * @returns {bigint}
 */
export function parseBigIntBase(str, base) {
  const clean = str.trim().replace(/\s+/g, '').replace(/^\+/, '')
  let neg = false
  let body = clean
  if (body.startsWith('-')) {
    neg = true
    body = body.slice(1)
  }
  if (!body) throw new Error('Empty number')
  let n = 0n
  const b = BigInt(base)
  for (const ch of body.toLowerCase()) {
    const v = DIGITS.indexOf(ch)
    if (v < 0 || v >= base) throw new Error(`Invalid digit "${ch}" for base ${base}`)
    n = n * b + BigInt(v)
  }
  return neg ? -n : n
}

/**
 * @param {bigint} n
 * @param {number} base 2-36
 * @returns {string}
 */
export function formatBigIntBase(n, base) {
  if (n === 0n) return '0'
  const neg = n < 0n
  let x = neg ? -n : n
  const b = BigInt(base)
  let s = ''
  while (x > 0n) {
    s = DIGITS[Number(x % b)] + s
    x /= b
  }
  return (neg ? '-' : '') + s
}
