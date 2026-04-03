<template>
  <div class="tool-page ts-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Timestamp Converter</h1>
    <div class="ts-layout">
      <div class="input-wrap ts-input">
        <textarea v-model="raw" placeholder="Unix (seconds or ms), ISO 8601, or RFC date string..."></textarea>
        <button type="button" class="clear-btn" @click="raw = ''; results = []">Clear</button>
      </div>
      <div class="output-wrap ts-output">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="parseInput">Convert</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <ul v-if="results.length" class="ts-list">
          <li v-for="row in results" :key="row.label" class="ts-row">
            <span class="ts-label">{{ row.label }}</span>
            <code class="ts-value">{{ row.value }}</code>
            <button type="button" class="ts-copy" @click="copy(row.value)">Copy</button>
          </li>
        </ul>
        <p v-else class="ts-hint">Paste a value and press Convert.</p>
      </div>
    </div>
    <div class="tool-help">
      <h2>Timestamp tips</h2>
      <p>Numeric strings: 10 digits are treated as seconds, 13 digits as milliseconds. You can also paste ISO strings like <code>2026-04-03T12:00:00Z</code>.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const raw = ref('')
const results = ref([])
const status = ref('Ready')

const parseInput = () => {
  const s = raw.value.trim()
  if (!s) {
    results.value = []
    status.value = 'Empty'
    return
  }

  let date = null

  if (/^\d+$/.test(s)) {
    const n = Number(s)
    const ms = s.length <= 10 ? n * 1000 : n
    date = new Date(ms)
  } else {
    const parsed = Date.parse(s)
    if (!Number.isNaN(parsed)) {
      date = new Date(parsed)
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    results.value = []
    status.value = 'Could not parse'
    return
  }

  const sec = Math.floor(date.getTime() / 1000)
  const ms = date.getTime()

  results.value = [
    { label: 'ISO 8601 (UTC)', value: date.toISOString() },
    { label: 'Local string', value: date.toString() },
    { label: 'Unix (seconds)', value: String(sec) },
    { label: 'Unix (milliseconds)', value: String(ms) },
    { label: 'UTC string', value: date.toUTCString() },
  ]
  status.value = 'OK'
  trackToolUse('timestamp', 'convert')
}

const copy = (value) => {
  navigator.clipboard.writeText(value).then(() => {
    trackEvent('copy', { tool: 'timestamp' })
    alert('Copied!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>

<style scoped>
.ts-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  padding: 0 15px;
}

.ts-input {
  min-height: 160px;
}

.ts-output {
  min-height: 160px;
}

.ts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ts-row {
  display: grid;
  grid-template-columns: minmax(100px, 140px) 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 0.88rem;
}

.ts-label {
  color: #64748b;
}

.app.dark .ts-label {
  color: #94a3b8;
}

.ts-value {
  font-family: 'Courier New', monospace;
  word-break: break-all;
  background: #f1f5f9;
  padding: 6px 8px;
  border-radius: 6px;
  color: #0f172a;
}

.app.dark .ts-value {
  background: #111827;
  color: #e2e8f0;
}

.ts-copy {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #9b59b6;
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
}

.ts-hint {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .ts-layout {
    flex-direction: column;
    padding: 0 10px;
  }

  .ts-row {
    grid-template-columns: 1fr;
  }

  .ts-copy {
    justify-self: start;
  }
}
</style>
