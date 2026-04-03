<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>XML Tools</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="inputText" placeholder="Paste XML here..."></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="doFormat">Format</button>
          <button type="button" class="action-btn" @click="doMinify">Minify</button>
          <button type="button" class="action-btn" @click="doToJson">XML → JSON</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>XML format &amp; JSON</h2>
      <p>
        Formatting uses the browser XML parser. XML → JSON uses a simple convention: attributes become keys like
        <code>@name</code>, repeated tags become arrays, and text-only leaves collapse to strings when possible.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatXmlString, minifyXmlString, xmlToJson } from '../utils/xml.js'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')

const doFormat = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    outputText.value = formatXmlString(inputText.value)
    status.value = 'Formatted'
    trackToolUse('xml', 'format')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const doMinify = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    outputText.value = minifyXmlString(inputText.value)
    status.value = 'Minified'
    trackToolUse('xml', 'minify')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const doToJson = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    const obj = xmlToJson(inputText.value)
    outputText.value = JSON.stringify(obj, null, 2)
    status.value = 'XML → JSON'
    trackToolUse('xml', 'to_json')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'xml' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>
