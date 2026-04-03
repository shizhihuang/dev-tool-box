<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>HTML Entities</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="inputText" placeholder="Paste text to escape or encoded entities to decode..."></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="doEscape">Escape</button>
          <button type="button" class="action-btn" @click="doUnescape">Unescape</button>
          <button type="button" class="action-btn" @click="swap">Swap</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>Escape vs unescape</h2>
      <p>
        <strong>Escape</strong> turns <code>&amp; &lt; &gt; " '</code> into entity form for safe HTML.
        <strong>Unescape</strong> uses the browser to resolve numeric and common named entities (e.g. <code>&amp;amp;</code> → <code>&amp;</code>).
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { escapeHtmlEntities, unescapeHtmlEntities } from '../utils/htmlEntities.js'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')

const doEscape = () => {
  outputText.value = escapeHtmlEntities(inputText.value)
  status.value = 'Escaped'
  trackToolUse('html_entities', 'escape')
}

const doUnescape = () => {
  outputText.value = unescapeHtmlEntities(inputText.value)
  status.value = 'Unescaped'
  trackToolUse('html_entities', 'unescape')
}

const swap = () => {
  const t = outputText.value
  outputText.value = inputText.value
  inputText.value = t
  trackToolUse('html_entities', 'swap')
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'html_entities' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>
