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
    <div class="tool-help">
      <h2>Regex Tester Guide</h2>
      <p>Test regular expressions with custom flags. Inspect matches or apply replace previews for common text-cleanup tasks.</p>
    </div>
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
