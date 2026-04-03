<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>URL Encode / Decode</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="urlInput" placeholder="Paste URL or text to encode/decode..."></textarea>
        <button type="button" class="clear-btn" @click="urlInput = ''; urlOutput = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="urlEncode">Encode</button>
          <button type="button" class="action-btn" @click="urlDecode">Decode</button>
          <button type="button" class="action-btn" @click="parseUrl">Parse URL</button>
          <button type="button" class="action-btn" @click="swapUrl">Swap</button>
          <button type="button" class="action-btn copy-btn" @click="copy(urlOutput, 'url')">Copy Result</button>
        </div>
        <pre class="result-content">{{ urlOutput }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>URL Encode/Decode Guide</h2>
      <p>Encode query parameters safely or decode percent-encoded strings when debugging redirects and API requests.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const urlInput = ref('')
const urlOutput = ref('')

const urlEncode = () => {
  try {
    urlOutput.value = encodeURIComponent(urlInput.value)
    trackToolUse('url', 'encode')
  } catch {
    urlOutput.value = 'Error: Invalid input'
  }
}

const urlDecode = () => {
  try {
    urlOutput.value = decodeURIComponent(urlInput.value)
    trackToolUse('url', 'decode')
  } catch {
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
  } catch {
    urlOutput.value = 'Error: Invalid URL for parsing'
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
