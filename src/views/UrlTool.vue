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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About URL encoding utilities</h2>
      <p>
        URLs reserve certain characters for structure (for example <code>?</code>, <code>&amp;</code>, <code>#</code>, and spaces).
        When you pass arbitrary text inside query parameters or path segments, you must percent-encode it so servers and
        browsers interpret your intent correctly. This page helps you encode or decode those sequences and inspect full URLs.
      </p>
      <p>
        The <strong>Parse URL</strong> action uses the WHATWG URL parser built into modern browsers, so you get the same
        decomposition you would expect in JavaScript fetch logs—ideal when debugging OAuth callbacks or misbehaving redirects.
      </p>

      <h2>When developers reach for this tool</h2>
      <ul>
        <li>Encoding user-supplied keywords before appending them to analytics or search endpoints.</li>
        <li>Decoding a copied curl command’s query string to understand each parameter.</li>
        <li>Breaking down production URLs to compare hostnames, paths, and hash fragments.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste the raw string you need to transform into the editor.</li>
        <li>Choose <strong>Encode</strong> for <code>encodeURIComponent</code> semantics (UTF-8 percent encoding).</li>
        <li>Choose <strong>Decode</strong> when you already have percent-encoded text.</li>
        <li>Use <strong>Parse URL</strong> only when the input is a full absolute URL (including scheme).</li>
        <li>Swap input/output when you want to chain decode → inspect → re-encode manually.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        All transformations execute locally. Your URLs may describe sensitive environments—clear the textarea afterward on shared laptops.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Does encodeURIComponent match RFC 3986?</dt>
        <dd>It follows the ECMAScript standard used by browsers, which is what most web stacks implement for component encoding.</dd>
        <dt>Why does parsing fail?</dt>
        <dd>The parser expects a valid absolute URL (for example <code>https://example.com/path</code>). Relative paths need a base URL in other APIs.</dd>
        <dt>Can I encode an entire URL?</dt>
        <dd>Usually you encode components, not the whole string, or you risk encoding the delimiters that give the URL structure.</dd>
        <dt>Does this send my URL to a server?</dt>
        <dd>No. Parsing and encoding happen entirely in your browser tab.</dd>
      </dl>
    </article>
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
