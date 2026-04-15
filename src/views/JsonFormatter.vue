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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About this JSON formatter</h2>
      <p>
        JSON (JavaScript Object Notation) is the lingua franca of modern APIs, configuration files, and log exports.
        This page gives you a fast, private workspace to pretty-print messy payloads, confirm syntax before a deploy,
        shrink JSON for bandwidth-sensitive clients, and turn tabular JSON into CSV for stakeholders who live in spreadsheets.
      </p>
      <p>
        Everything runs in your browser: your documents are not uploaded to our servers. That makes this tool suitable
        for production API responses, internal tokens (still: be careful on shared machines), and one-off debugging sessions.
      </p>

      <h2>When this tool helps</h2>
      <ul>
        <li>Validating a response body from REST or GraphQL before you commit it to documentation.</li>
        <li>Normalizing config JSON so Git diffs stay readable across teams.</li>
        <li>Minifying JSON for mobile payloads or embedded firmware messages.</li>
        <li>Exporting an array of homogeneous objects to CSV for finance or operations teams.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste or type JSON into the left editor. You can trigger a quick format pass as you type.</li>
        <li>Use <strong>Format</strong> for indented, human-readable output with syntax highlighting on the right.</li>
        <li>Use <strong>Minify</strong> when you need a single-line payload for storage or transmission.</li>
        <li>Use <strong>Sort Keys</strong> to alphabetize keys recursively—ideal before comparing two large objects.</li>
        <li>Use <strong>JSON to CSV</strong> when the root value is an object or an array of objects with similar keys.</li>
        <li>Use <strong>Copy Result</strong> once you are satisfied; the plain text buffer avoids HTML markup from the highlighter.</li>
      </ol>

      <h2>Tips</h2>
      <ul>
        <li>Very large files may slow down the tab; consider splitting or sampling in those cases.</li>
        <li>If <strong>Validate</strong> fails, scroll to the position indicated by your editor—the error is usually a trailing comma or a stray quote.</li>
        <li>CSV export uses the union of keys across rows; missing keys render as blank cells.</li>
      </ul>

      <h2>Privacy on this page</h2>
      <p>
        Parsing and stringification happen locally via your browser’s JavaScript engine. Clear the editor when you finish
        if others use the same device.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Does this tool send my JSON to a server?</dt>
        <dd>No. Network calls you see in DevTools should only reflect analytics or ads, not your pasted JSON content.</dd>
        <dt>Why does minified JSON look unreadable?</dt>
        <dd>That is intentional—whitespace is removed to save bytes. Keep a formatted copy in source control for humans.</dd>
        <dt>Why did JSON to CSV fail?</dt>
        <dd>The converter expects an object or an array of objects. Arrays of primitives or deeply nested graphs need a different approach.</dd>
        <dt>Can I sort keys inside nested objects?</dt>
        <dd>Yes. Sort Keys walks the tree recursively so nested structures share the same deterministic ordering.</dd>
        <dt>Is Unicode preserved?</dt>
        <dd>Yes. The editor treats input as UTF-16 JavaScript strings, so international text remains intact.</dd>
      </dl>
    </article>
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
