<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Regex Tester</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="regexText" placeholder="Paste text to test regex..."></textarea>
        <button type="button" class="clear-btn" @click="regexText = ''; regexOutput = ''; regexStatus = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="regex-controls">
          <input v-model="regexPattern" class="regex-input" placeholder="Pattern, e.g. \\b\\w+@\\w+\\.\\w+\\b" />
          <input v-model="regexFlags" class="regex-input small" placeholder="Flags: g i m" />
        </div>
        <div class="action-bar">
          <button type="button" class="action-btn" @click="runRegexMatch">Match</button>
          <button type="button" class="action-btn" @click="runRegexReplace">Replace</button>
          <button type="button" class="action-btn" @click="swapRegex">Swap</button>
          <button type="button" class="action-btn copy-btn" @click="copy(regexOutput, 'regex')">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ regexStatus }}</span>
        </div>
        <pre class="result-content">{{ regexOutput }}</pre>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About this JavaScript regex tester</h2>
      <p>
        Regular expressions are easy to get subtly wrong. This workspace mirrors the <code>RegExp</code> engine available in
        Chrome, Firefox, Safari, or Edge so you can prototype patterns for input validation, log mining, or refactors before
        you paste them into production code.
      </p>
      <p>
        The <strong>Match</strong> action lists every capture with indexes (when the global flag is present). The
        <strong>Replace</strong> action shows a simple preview where each match becomes the literal text <code>[MATCH]</code>—enough
        to reason about coverage without overwriting your source data.
      </p>

      <h2>Good fits for this page</h2>
      <ul>
        <li>Sanity-checking email or phone patterns against real-world samples.</li>
        <li>Exploring how greedy versus lazy quantifiers change match length.</li>
        <li>Teaching teammates how multiline (<code>m</code>) or case-insensitive (<code>i</code>) flags behave.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste representative text on the left. Include edge cases you care about.</li>
        <li>Enter your pattern without surrounding slashes.</li>
        <li>Add flags such as <code>g</code>, <code>i</code>, or <code>m</code> in the flags field (spaces are ignored).</li>
        <li>Click <strong>Match</strong> to enumerate hits as JSON, or <strong>Replace</strong> for a quick substitution preview.</li>
        <li>Iterate until the status line reports the count you expect.</li>
      </ol>

      <h2>Performance &amp; safety tips</h2>
      <p>
        Catastrophic backtracking can freeze the tab if a pattern combinatorially explodes. Start with small samples, then scale up.
        Never run untrusted regex against untrusted megabyte logs without safeguards.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Is this PCRE?</dt>
        <dd>No. It is JavaScript’s regex flavor. Lookaheads are supported, but some PCRE-only features are unavailable.</dd>
        <dt>Why do I see “No matches found”?</dt>
        <dd>Confirm the global flag when you expect multiple hits, and verify that special characters are not over-escaped in the pattern field.</dd>
        <dt>Can I use replacement templates?</dt>
        <dd>This UI uses a fixed placeholder for preview purposes. Move to your editor or tests for dollar-sign capture replacements.</dd>
        <dt>Does my sample text leave the browser?</dt>
        <dd>No. Matching executes locally.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const regexText = ref('')
const regexPattern = ref('')
const regexFlags = ref('g')
const regexOutput = ref('')
const regexStatus = ref('Ready')

const getRegex = () => new RegExp(regexPattern.value, regexFlags.value.replace(/\s+/g, ''))

const runRegexMatch = () => {
  try {
    const reg = getRegex()
    const normalized = reg.global ? reg : new RegExp(reg.source, `${reg.flags}g`)
    const matches = [...regexText.value.matchAll(normalized)].map((m) => ({
      match: m[0],
      index: m.index,
      groups: m.groups || {},
    }))
    regexOutput.value = matches.length ? JSON.stringify(matches, null, 2) : 'No matches found'
    regexStatus.value = `Matched ${matches.length} item(s)`
    trackToolUse('regex', 'match')
  } catch {
    regexStatus.value = 'Invalid pattern or flags'
    regexOutput.value = 'Error: Invalid regex pattern/flags'
  }
}

const runRegexReplace = () => {
  try {
    const reg = getRegex()
    regexOutput.value = regexText.value.replace(reg, '[MATCH]')
    regexStatus.value = 'Replace preview generated'
    trackToolUse('regex', 'replace')
  } catch {
    regexStatus.value = 'Invalid pattern or flags'
    regexOutput.value = 'Error: Invalid regex pattern/flags'
  }
}

const swapRegex = () => {
  const next = regexOutput.value
  regexOutput.value = regexText.value
  regexText.value = next
  trackToolUse('regex', 'swap')
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
