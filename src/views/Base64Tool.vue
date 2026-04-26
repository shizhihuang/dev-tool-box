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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About Base64 for text</h2>
      <p>
        Base64 encodes binary data as ASCII text so it can travel through email, JSON fields, or URL-safe channels.
        This utility focuses on UTF-8 text: it is ideal for quick experiments with JWT segments, small blobs embedded
        in configuration, or debugging serialization layers—without installing a desktop client.
      </p>
      <p>
        Encoding uses the browser’s built-in binary primitives so your string never leaves the device. Always treat
        decoded material as sensitive if it originated from production systems.
      </p>

      <h2>Typical use cases</h2>
      <ul>
        <li>Checking whether a token is valid Base64 before you decode it elsewhere.</li>
        <li>Embedding short Unicode strings in environments that only tolerate ASCII.</li>
        <li>Comparing encoder output with another language’s standard library for parity tests.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste UTF-8 text on the left when you need an ASCII-safe representation.</li>
        <li>Click <strong>Encode</strong> to generate Base64. Non-Latin characters are supported through UTF-8 normalization.</li>
        <li>Click <strong>Decode</strong> when the left field already contains Base64 text.</li>
        <li>Use <strong>Swap</strong> to move the output back into the editor for chained operations.</li>
        <li>Copy the final string once you verify the transformation is correct.</li>
      </ol>

      <h2>Limitations</h2>
      <p>
        Extremely large strings may hit memory limits in the tab. For big files, prefer streaming tools or command-line
        utilities. This page is optimized for developer-sized snippets, not multi-megabyte archives.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Why does decode fail?</dt>
        <dd>Padding must be correct and the alphabet must be standard Base64. Remove whitespace or URL-safe variants unless you pre-normalize them.</dd>
        <dt>Is this URL-safe Base64?</dt>
        <dd>No. This encoder follows the standard alphabet. Replace <code>+</code>/<code>/</code> manually if a downstream system requires URL-safe form.</dd>
        <dt>Does encoding encrypt data?</dt>
        <dd>No. Anyone can decode Base64—it is encoding, not encryption.</dd>
        <dt>Can I encode binary files?</dt>
        <dd>Use the dedicated Image → Base64 tool for files. Plain text mode assumes UTF-8 string input.</dd>
      </dl>
    </article>
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
