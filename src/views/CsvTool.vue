<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>CSV Formatter &amp; Converter</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="inputText" placeholder="Paste CSV or JSON array of objects..."></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar row-with-field">
          <label class="delim-label">Delimiter <input v-model="delimiter" maxlength="1" class="delim-input" /></label>
          <button type="button" class="action-btn" @click="formatPretty">Format (columns)</button>
          <button type="button" class="action-btn" @click="minifyCsv">Minify</button>
          <button type="button" class="action-btn" @click="csvToJson">CSV → JSON</button>
          <button type="button" class="action-btn" @click="jsonToCsv">JSON → CSV</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>CSV tools</h2>
      <p>Align columns for readability, convert the first row to JSON keys, or turn an array of objects into CSV.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { parseCsv, rowsToCsv, formatCsvPretty, csvRowsToObjects } from '../utils/csv.js'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')
const delimiter = ref(',')

const d = () => delimiter.value || ','

const formatPretty = () => {
  try {
    const rows = parseCsv(inputText.value, d())
    outputText.value = formatCsvPretty(rows)
    status.value = 'Formatted'
    trackToolUse('csv', 'format')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const minifyCsv = () => {
  try {
    const rows = parseCsv(inputText.value, d())
    outputText.value = rowsToCsv(rows, d())
    status.value = 'Minified'
    trackToolUse('csv', 'minify')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const csvToJson = () => {
  try {
    const rows = parseCsv(inputText.value, d())
    if (!rows.length) {
      outputText.value = '[]'
      status.value = 'Empty'
      return
    }
    const objects = csvRowsToObjects(rows)
    outputText.value = JSON.stringify(objects, null, 2)
    status.value = 'CSV → JSON'
    trackToolUse('csv', 'to_json')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const jsonToCsv = () => {
  try {
    const parsed = JSON.parse(inputText.value)
    const rows = Array.isArray(parsed) ? parsed : [parsed]
    if (!rows.length || typeof rows[0] !== 'object' || rows[0] === null) {
      throw new Error('JSON must be an array of objects (or one object)')
    }
    const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))]
    const body = rows.map((row) => headers.map((h) => row[h]))
    const all = [headers, ...body]
    outputText.value = rowsToCsv(all, d())
    status.value = 'JSON → CSV'
    trackToolUse('csv', 'from_json')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'JSON parse error'
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'csv' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed, please copy manually')
  })
}
</script>

<style scoped>
.row-with-field {
  align-items: center;
}
.delim-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #7f8c8d;
}
.app.dark .delim-label {
  color: #bdc3c7;
}
.delim-input {
  width: 2rem;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px;
  background: #fff;
  color: #2c3e50;
}
.app.dark .delim-input {
  background: #111827;
  border-color: #374151;
  color: #f8f8f8;
}
</style>
