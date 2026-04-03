<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Base64 Encode / Decode</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="b64Input" placeholder="Paste text to encode/decode..."></textarea>
        <button type="button" class="clear-btn" @click="b64Input = ''; b64Output = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="b64Encode">Encode</button>
          <button type="button" class="action-btn" @click="b64Decode">Decode</button>
          <button type="button" class="action-btn" @click="swapBase64">Swap</button>
          <button type="button" class="action-btn copy-btn" @click="copy(b64Output, 'base64')">Copy Result</button>
        </div>
        <pre class="result-content">{{ b64Output }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>Base64 Encode/Decode Guide</h2>
      <p>Convert plain text to Base64 or decode Base64 back to UTF-8 text. Useful for debugging tokens and payloads.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const b64Input = ref('')
const b64Output = ref('')

const b64Encode = () => {
  try {
    b64Output.value = btoa(unescape(encodeURIComponent(b64Input.value)))
    trackToolUse('base64', 'encode')
  } catch {
    b64Output.value = 'Error: Invalid input'
  }
}

const b64Decode = () => {
  try {
    b64Output.value = decodeURIComponent(escape(atob(b64Input.value)))
    trackToolUse('base64', 'decode')
  } catch {
    b64Output.value = 'Error: Invalid Base64 string'
  }
}

const swapBase64 = () => {
  const next = b64Output.value
  b64Output.value = b64Input.value
  b64Input.value = next
  trackToolUse('base64', 'swap')
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
