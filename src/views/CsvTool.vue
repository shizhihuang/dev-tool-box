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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About these CSV utilities</h2>
      <p>
        CSV looks simple until you encounter quoted fields, embedded commas, or regional exports from finance teams.
        This workspace helps you visually align columns for code review, shrink files back to strict delimiter-only rows,
        and move between CSV and JSON when APIs demand structured objects.
      </p>
      <p>
        The delimiter field defaults to comma but accepts semicolons or tabs when you work with European spreadsheets or TSV dumps.
        Parsing follows a standard quoted-field state machine so newline characters inside quotes are preserved.
      </p>

      <h2>When teams use this page</h2>
      <ul>
        <li>Beautifying a vendor CSV before attaching it to a ticket.</li>
        <li>Converting spreadsheet exports to JSON arrays for unit tests.</li>
        <li>Generating CSV fixtures from JSON objects returned by staging APIs.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste CSV into the editor (include a header row for JSON conversion).</li>
        <li>Set the delimiter character if you are not using commas.</li>
        <li>Choose <strong>Format (columns)</strong> for monospace-aligned columns, or <strong>Minify</strong> to remove padding.</li>
        <li>Use <strong>CSV → JSON</strong> when the first row should become object keys.</li>
        <li>Use <strong>JSON → CSV</strong> when the left editor contains an array of homogeneous objects.</li>
      </ol>

      <h2>Data handling</h2>
      <p>
        All transformations execute locally. Large CSV files may stress the tab; trim columns or sample rows if performance drops.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Why is my JSON → CSV empty?</dt>
        <dd>Ensure the payload is an array of objects (or a single object). Arrays of strings are not supported by this generator.</dd>
        <dt>How are missing keys handled?</dt>
        <dd>The exporter uses the union of keys across rows. Missing values become blank cells.</dd>
        <dt>Does CSV → JSON support nested objects?</dt>
        <dd>No. Each row becomes a flat object with string values. Normalize nested structures before converting.</dd>
        <dt>Is data uploaded?</dt>
        <dd>No. Everything stays in your browser session.</dd>
      </dl>
    </article>
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
