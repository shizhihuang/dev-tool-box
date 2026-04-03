<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>JSON Formatter</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="jsonInput" @input="formatJson" placeholder="Paste your JSON here..."></textarea>
        <button type="button" class="clear-btn" @click="jsonInput = ''; jsonOutput = ''; jsonOutputText = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="formatJson">Format</button>
          <button type="button" class="action-btn" @click="minifyJson">Minify</button>
          <button type="button" class="action-btn" @click="sortJsonKeys">Sort Keys</button>
          <button type="button" class="action-btn" @click="jsonToCsv">JSON to CSV</button>
          <button type="button" class="action-btn" @click="validateJson">Validate</button>
          <button type="button" class="action-btn copy-btn" @click="copy(jsonOutputText, 'json')">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>Lines: {{ jsonLineCount }}</span>
          <span>Chars: {{ jsonCharCount }}</span>
          <span>{{ jsonStatus }}</span>
        </div>
        <pre v-html="jsonOutput" class="result-content"></pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>JSON Formatter Guide</h2>
      <p>Use this tool to validate, format, minify, and sort JSON keys before sharing API payloads or config files.</p>
      <ul>
        <li><strong>Format:</strong> Pretty-print JSON with indentation for readability.</li>
        <li><strong>Minify:</strong> Remove whitespace to reduce payload size.</li>
        <li><strong>Sort Keys:</strong> Output stable key order to make diffs cleaner.</li>
        <li><strong>JSON to CSV:</strong> Convert array-of-object JSON into CSV for spreadsheets.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

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
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(value[key])
        return acc
      }, {})
  }
  return value
}

const highlightJson = (str) =>
  str
    .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
    .replace(/: (\d+(\.\d+)?)/g, ': <span class="num">$1</span>')
    .replace(/: (true|false)/g, ': <span class="bool">$1</span>')
    .replace(/: (null)/g, ': <span class="null">$1</span>')

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
    jsonOutput.value = highlightJson(str)
    jsonStatus.value = 'Valid JSON'
    updateJsonMeta(str)
  } catch {
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
  } catch {
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
    jsonOutput.value = highlightJson(str)
    jsonStatus.value = 'Sorted by keys'
    updateJsonMeta(str)
    trackToolUse('json', 'sort_keys')
  } catch {
    jsonStatus.value = 'Invalid JSON'
    jsonOutput.value = '<span class="error">Invalid JSON format</span>'
  }
}

const validateJson = () => {
  try {
    JSON.parse(jsonInput.value)
    jsonStatus.value = 'Validation passed'
    trackToolUse('json', 'validate')
  } catch {
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
    const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(','))].join('\n')
    jsonOutputText.value = csv
    jsonOutput.value = csv
    jsonStatus.value = 'Converted to CSV'
    updateJsonMeta(csv)
    trackToolUse('json', 'to_csv')
  } catch {
    jsonStatus.value = 'CSV conversion failed'
    jsonOutput.value = '<span class="error">JSON to CSV requires an object or array of objects</span>'
    jsonOutputText.value = ''
  }
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
