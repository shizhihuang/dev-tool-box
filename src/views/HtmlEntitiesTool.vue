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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About HTML entity tools</h2>
      <p>
        Web pages treat certain characters as markup delimiters. When you embed user-generated text inside HTML attributes or
        template literals, you must escape those characters so browsers do not interpret them as tags. Conversely, when you import
        legacy HTML snippets into React or Vue, you often need to decode entities back to Unicode for editing.
      </p>
      <p>
        This page offers bidirectional helpers: <strong>Escape</strong> applies the canonical replacements for ampersands, angle brackets,
        and both quote styles. <strong>Unescape</strong> leverages the browser’s HTML parser through a detached textarea so numeric
        entities like <code>&amp;#39;</code> and named entities like <code>&amp;nbsp;</code> resolve correctly.
      </p>

      <h2>Common scenarios</h2>
      <ul>
        <li>Preparing copy for CMS fields that accept raw HTML but not arbitrary script tags.</li>
        <li>Decoding email fragments before analysis.</li>
        <li>Sanity-checking double-encoding bugs (<code>&amp;amp;amp;</code>) in localization files.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste the string you need to transform.</li>
        <li>Choose <strong>Escape</strong> before inserting into HTML or XML contexts.</li>
        <li>Choose <strong>Unescape</strong> when you start with encoded entities.</li>
        <li>Use <strong>Swap</strong> to bounce output back into the editor for chained fixes.</li>
      </ol>

      <h2>Security reminder</h2>
      <p>
        Decoding entities does not sanitize JavaScript. Never write decoded user content into <code>innerHTML</code> without a dedicated sanitizer.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Does escape cover every Unicode character?</dt>
        <dd>It covers the dangerous structural characters. Other symbols pass through unchanged.</dd>
        <dt>Why does unescape differ from Python’s html.unescape?</dt>
        <dd>Browser parsers follow HTML living-standard rules, which may differ slightly from other runtimes.</dd>
        <dt>Is data uploaded?</dt>
        <dd>No. Both directions run locally.</dd>
        <dt>Can I escape for XML attributes?</dt>
        <dd>Yes for basic cases, but XML may require additional entity definitions depending on your schema.</dd>
      </dl>
    </article>
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
