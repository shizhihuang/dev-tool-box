<template>
  <div class="home">
    <div class="tabs">
      <button :class="{ active: tab === 'json' }" @click="setTab('json')">JSON Formatter</button>
      <button :class="{ active: tab === 'base64' }" @click="setTab('base64')">Base64 Encode/Decode</button>
      <button :class="{ active: tab === 'url' }" @click="setTab('url')">URL Encode/Decode</button>
      <button :class="{ active: tab === 'regex' }" @click="setTab('regex')">Regex Tester</button>
    </div>

    <div v-if="tab === 'json'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="jsonInput" @input="formatJson" placeholder="Paste your JSON here..."></textarea>
        <button class="clear-btn" @click="jsonInput = ''; jsonOutput = ''; jsonOutputText = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="formatJson">Format</button>
          <button class="action-btn" @click="minifyJson">Minify</button>
          <button class="action-btn" @click="sortJsonKeys">Sort Keys</button>
          <button class="action-btn" @click="jsonToCsv">JSON to CSV</button>
          <button class="action-btn" @click="validateJson">Validate</button>
          <button class="action-btn copy-btn" @click="copy(jsonOutputText, 'json')">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>Lines: {{ jsonLineCount }}</span>
          <span>Chars: {{ jsonCharCount }}</span>
          <span>{{ jsonStatus }}</span>
        </div>
        <pre v-html="jsonOutput" class="result-content"></pre>
      </div>
    </div>
    <div v-if="tab === 'json'" class="tool-help">
      <h3>JSON Formatter Guide</h3>
      <p>Use this tool to validate, format, minify, and sort JSON keys before sharing API payloads or config files.</p>
      <ul>
        <li><strong>Format:</strong> Pretty-print JSON with indentation for readability.</li>
        <li><strong>Minify:</strong> Remove whitespace to reduce payload size.</li>
        <li><strong>Sort Keys:</strong> Output stable key order to make diffs cleaner.</li>
        <li><strong>JSON to CSV:</strong> Convert array-of-object JSON into CSV for spreadsheets.</li>
      </ul>
    </div>

    <div v-if="tab === 'base64'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="b64Input" placeholder="Paste text to encode/decode..."></textarea>
        <button class="clear-btn" @click="b64Input = ''; b64Output = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="b64Encode">Encode</button>
          <button class="action-btn" @click="b64Decode">Decode</button>
          <button class="action-btn" @click="swapBase64">Swap</button>
          <button class="action-btn copy-btn" @click="copy(b64Output, 'base64')">Copy Result</button>
        </div>
        <pre class="result-content">{{ b64Output }}</pre>
      </div>
    </div>
    <div v-if="tab === 'base64'" class="tool-help">
      <h3>Base64 Encode/Decode Guide</h3>
      <p>Convert plain text to Base64 or decode Base64 back to UTF-8 text. Useful for debugging tokens and payloads.</p>
    </div>

    <div v-if="tab === 'url'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="urlInput" placeholder="Paste URL to encode/decode..."></textarea>
        <button class="clear-btn" @click="urlInput = ''; urlOutput = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="urlEncode">Encode</button>
          <button class="action-btn" @click="urlDecode">Decode</button>
          <button class="action-btn" @click="parseUrl">Parse URL</button>
          <button class="action-btn" @click="swapUrl">Swap</button>
          <button class="action-btn copy-btn" @click="copy(urlOutput, 'url')">Copy Result</button>
        </div>
        <pre class="result-content">{{ urlOutput }}</pre>
      </div>
    </div>
    <div v-if="tab === 'url'" class="tool-help">
      <h3>URL Encode/Decode Guide</h3>
      <p>Encode query parameters safely or decode percent-encoded strings when debugging redirects and API requests.</p>
    </div>

    <div v-if="tab === 'regex'" class="tool-layout">
      <div class="input-wrap">
        <textarea
          v-model="regexText"
          placeholder="Paste text to test regex..."
        ></textarea>
        <button class="clear-btn" @click="regexText = ''; regexOutput = ''; regexStatus = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="regex-controls">
          <input v-model="regexPattern" class="regex-input" placeholder="Pattern, e.g. \\b\\w+@\\w+\\.\\w+\\b" />
          <input v-model="regexFlags" class="regex-input small" placeholder="Flags: g i m" />
        </div>
        <div class="action-bar">
          <button class="action-btn" @click="runRegexMatch">Match</button>
          <button class="action-btn" @click="runRegexReplace">Replace</button>
          <button class="action-btn" @click="swapRegex">Swap</button>
          <button class="action-btn copy-btn" @click="copy(regexOutput, 'regex')">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ regexStatus }}</span>
        </div>
        <pre class="result-content">{{ regexOutput }}</pre>
      </div>
    </div>
    <div v-if="tab === 'regex'" class="tool-help">
      <h3>Regex Tester Guide</h3>
      <p>Test regular expressions with custom flags. Quickly inspect matches or apply replace operations for common text-cleanup tasks.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackTabSelect, trackToolUse, trackEvent } from '../utils/analytics.js'

const tab = ref('json')
const setTab = (t) => {
  tab.value = t
  trackTabSelect(t)
}

const jsonInput = ref('')
const jsonOutput = ref('')
const jsonOutputText = ref('')
const jsonStatus = ref('Ready')
const jsonLineCount = ref(0)
const jsonCharCount = ref(0)
const updateJsonMeta = (text) => {
  jsonCharCount.value = text.length
  jsonLineCount.value = text ? text.split('\n').length : 0
}
const sortObjectKeys = (value) => {
  if (Array.isArray(value)) return value.map(sortObjectKeys)
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = sortObjectKeys(value[key])
      return acc
    }, {})
  }
  return value
}
const formatJson = () => {
  try {
    if (!jsonInput.value) {
      jsonOutput.value = ''
      jsonOutputText.value = ''
      jsonStatus.value = 'Ready'
      updateJsonMeta('')
      return
    }
    const obj = JSON.parse(jsonInput.value)
    const str = JSON.stringify(obj, null, 2)
    jsonOutputText.value = str
    jsonOutput.value = str
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+(\.\d+)?)/g, ': <span class="num">$1</span>')
      .replace(/: (true|false)/g, ': <span class="bool">$1</span>')
      .replace(/: (null)/g, ': <span class="null">$1</span>')
    jsonStatus.value = 'Valid JSON'
    updateJsonMeta(str)
  } catch (e) {
    jsonOutput.value = '<span class="error">Invalid JSON format</span>'
    jsonOutputText.value = ''
    jsonStatus.value = 'Invalid JSON'
    updateJsonMeta(jsonInput.value)
  }
}
const minifyJson = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    const str = JSON.stringify(obj)
    jsonOutputText.value = str
    jsonOutput.value = str
    jsonStatus.value = 'Minified'
    updateJsonMeta(str)
    trackToolUse('json', 'minify')
  } catch (e) {
    jsonStatus.value = 'Invalid JSON'
    jsonOutput.value = '<span class="error">Invalid JSON format</span>'
  }
}
const sortJsonKeys = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    const sorted = sortObjectKeys(obj)
    const str = JSON.stringify(sorted, null, 2)
    jsonOutputText.value = str
    jsonOutput.value = str
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+(\.\d+)?)/g, ': <span class="num">$1</span>')
      .replace(/: (true|false)/g, ': <span class="bool">$1</span>')
      .replace(/: (null)/g, ': <span class="null">$1</span>')
    jsonStatus.value = 'Sorted by keys'
    updateJsonMeta(str)
    trackToolUse('json', 'sort_keys')
  } catch (e) {
    jsonStatus.value = 'Invalid JSON'
    jsonOutput.value = '<span class="error">Invalid JSON format</span>'
  }
}
const validateJson = () => {
  try {
    JSON.parse(jsonInput.value)
    jsonStatus.value = 'Validation passed'
    trackToolUse('json', 'validate')
  } catch (e) {
    jsonStatus.value = 'Validation failed'
  }
}
const jsonToCsv = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    const rows = Array.isArray(parsed) ? parsed : [parsed]
    if (!rows.length || typeof rows[0] !== 'object' || rows[0] === null) {
      throw new Error('JSON must be an object or array of objects')
    }
    const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))]
    const escapeCsv = (value) => {
      const str = value === null || value === undefined ? '' : String(value)
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')),
    ].join('\n')
    jsonOutputText.value = csv
    jsonOutput.value = csv
    jsonStatus.value = 'Converted to CSV'
    updateJsonMeta(csv)
    trackToolUse('json', 'to_csv')
  } catch (e) {
    jsonStatus.value = 'CSV conversion failed'
    jsonOutput.value = '<span class="error">JSON to CSV requires an object or array of objects</span>'
    jsonOutputText.value = ''
  }
}

const b64Input = ref('')
const b64Output = ref('')
const b64Encode = () => {
  try {
    b64Output.value = btoa(unescape(encodeURIComponent(b64Input.value)))
    trackToolUse('base64', 'encode')
  } catch (e) {
    b64Output.value = 'Error: Invalid input'
  }
}
const b64Decode = () => {
  try {
    b64Output.value = decodeURIComponent(escape(atob(b64Input.value)))
    trackToolUse('base64', 'decode')
  } catch (e) {
    b64Output.value = 'Error: Invalid Base64 string'
  }
}
const swapBase64 = () => {
  const next = b64Output.value
  b64Output.value = b64Input.value
  b64Input.value = next
  trackToolUse('base64', 'swap')
}

const urlInput = ref('')
const urlOutput = ref('')
const urlEncode = () => {
  try {
    urlOutput.value = encodeURIComponent(urlInput.value)
    trackToolUse('url', 'encode')
  } catch (e) {
    urlOutput.value = 'Error: Invalid input'
  }
}
const urlDecode = () => {
  try {
    urlOutput.value = decodeURIComponent(urlInput.value)
    trackToolUse('url', 'decode')
  } catch (e) {
    urlOutput.value = 'Error: Invalid URL encoded string'
  }
}
const swapUrl = () => {
  const next = urlOutput.value
  urlOutput.value = urlInput.value
  urlInput.value = next
  trackToolUse('url', 'swap')
}
const parseUrl = () => {
  try {
    const target = new URL(urlInput.value)
    const params = Object.fromEntries(target.searchParams.entries())
    const parsed = {
      href: target.href,
      protocol: target.protocol,
      host: target.host,
      hostname: target.hostname,
      pathname: target.pathname,
      query: params,
      hash: target.hash || '',
    }
    urlOutput.value = JSON.stringify(parsed, null, 2)
    trackToolUse('url', 'parse')
  } catch (e) {
    urlOutput.value = 'Error: Invalid URL for parsing'
  }
}

const regexText = ref('')
const regexPattern = ref('')
const regexFlags = ref('g')
const regexOutput = ref('')
const regexStatus = ref('Ready')
const getRegex = () => new RegExp(regexPattern.value, regexFlags.value.replace(/\s+/g, ''))
const runRegexMatch = () => {
  try {
    const reg = getRegex()
    const normalized = reg.global ? reg : new RegExp(reg.source, `${reg.flags}g`)
    const matches = [...regexText.value.matchAll(normalized)].map((m) => ({
      match: m[0],
      index: m.index,
      groups: m.groups || {},
    }))
    regexOutput.value = matches.length
      ? JSON.stringify(matches, null, 2)
      : 'No matches found'
    regexStatus.value = `Matched ${matches.length} item(s)`
    trackToolUse('regex', 'match')
  } catch (e) {
    regexStatus.value = 'Invalid pattern or flags'
    regexOutput.value = 'Error: Invalid regex pattern/flags'
  }
}
const runRegexReplace = () => {
  try {
    const reg = getRegex()
    regexOutput.value = regexText.value.replace(reg, '[MATCH]')
    regexStatus.value = 'Replace preview generated'
    trackToolUse('regex', 'replace')
  } catch (e) {
    regexStatus.value = 'Invalid pattern or flags'
    regexOutput.value = 'Error: Invalid regex pattern/flags'
  }
}
const swapRegex = () => {
  const next = regexOutput.value
  regexOutput.value = regexText.value
  regexText.value = next
  trackToolUse('regex', 'swap')
}

const copy = (text, tool) => {
  if (!text || text.includes('Error') || text.includes('Invalid')) return
  navigator.clipboard.writeText(text).then(() => {
    if (tool) trackEvent('copy', { tool })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed, please copy manually')
  })
}
</script>

<style>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  height: 40px;
  padding: 0 15px;
  flex-shrink: 0;
}
.tabs button {
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  color: #2c3e50;
  cursor: pointer;
  font-size: 0.9rem;
}
.tabs button.active {
  background: #3498db;
  color: white;
}
.app.dark .tabs button {
  background: #333;
  color: #f8f8f8;
}
.app.dark .tabs button.active {
  background: #3498db;
}

.tool-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  padding: 0 15px;
}
.input-wrap {
  flex: 1;
  position: relative;
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  min-height: 0;
}
.app.dark .input-wrap {
  border-color: #444;
}
.input-wrap textarea {
  width: 100%;
  height: 100%;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
  resize: none;
  background: #f8f9fa;
  color: #2c3e50;
}
.app.dark .input-wrap textarea {
  background: #2c2c2c;
  color: #f8f8f8;
}
.clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  font-size: 0.8rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}
.output-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px;
  background: #f8f9fa;
  min-height: 0;
}
.app.dark .output-wrap {
  border-color: #444;
  background: #2c2c2c;
}
.action-bar {
  display: flex;
  gap: 10px;
  min-height: 40px;
  flex-wrap: wrap;
}
.action-btn {
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}
.copy-btn {
  background: #9b59b6 !important;
}
.app.dark .action-btn {
  background: #27ae60;
}
.app.dark .copy-btn {
  background: #8e44ad !important;
}
.result-content {
  flex: 1;
  padding: 10px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: #2c3e50;
}
.meta-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: #7f8c8d;
}
.app.dark .meta-bar {
  color: #bdc3c7;
}
.tool-help {
  margin: 10px 15px 0;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  background: #f8fafc;
  font-size: 0.92rem;
  line-height: 1.6;
}
.tool-help h3 {
  margin-bottom: 6px;
  font-size: 1rem;
}
.tool-help p {
  margin-bottom: 6px;
}
.tool-help ul {
  margin-left: 1rem;
}
.regex-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.regex-input {
  flex: 1;
  min-width: 160px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #2c3e50;
}
.regex-input.small {
  flex: 0 0 120px;
}
.app.dark .regex-input {
  background: #111827;
  border-color: #374151;
  color: #f8f8f8;
}
.app.dark .tool-help {
  border-color: #3f3f46;
  background: #1f2937;
}
.app.dark .result-content {
  color: #f8f8f8;
}
.key { color: #2980b9 !important; font-weight: bold !important; }
.str { color: #27ae60 !important; }
.num { color: #e67e22 !important; }
.bool { color: #8e44ad !important; }
.null { color: #7f8c8d !important; }
.error { color: #e74c3c !important; font-weight: bold !important; }

@media (max-width: 768px) {
  .tabs {
    height: auto;
    margin-bottom: 10px;
    padding: 0 10px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .tabs button {
    width: 100%;
    padding: 0 10px;
    font-size: 0.82rem;
    height: 36px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-layout {
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;
  }
  .input-wrap, .output-wrap {
    flex: 1;
    height: auto;
    min-height: 0;
  }

  .input-wrap textarea {
    padding: 12px;
    font-size: 0.9rem;
  }

  .output-wrap {
    padding: 8px;
  }

  .action-bar {
    min-height: 36px;
    gap: 8px;
  }
  .action-btn {
    padding: 0 14px;
    font-size: 0.85rem;
  }

  .clear-btn {
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .result-content {
    padding: 8px;
    font-size: 0.9rem;
  }
  .regex-input {
    min-width: 0;
    width: 100%;
    font-size: 0.85rem;
  }
  .regex-input.small {
    flex-basis: 100%;
  }
}

@media (max-width: 480px) {
  .tabs button {
    font-size: 0.78rem;
  }

  .tool-layout {
    gap: 8px;
  }

  /* 让输入区略大一点，更符合使用习惯 */
  .input-wrap {
    flex: 1.2;
  }
  .output-wrap {
    flex: 0.8;
  }

  .input-wrap, .output-wrap {
    border-radius: 10px;
  }
}
</style>
