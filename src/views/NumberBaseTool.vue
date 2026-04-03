<template>
  <div class="tool-page nb-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Number Base Converter</h1>
    <div class="nb-layout">
      <div class="input-wrap nb-input">
        <textarea v-model="inputText" placeholder="Number in source base (e.g. FF, 1010, -1a2)"></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar bases">
          <label class="base-field">
            From base
            <input v-model.number="fromBase" type="number" min="2" max="36" class="base-in" />
          </label>
          <label class="base-field">
            To base
            <input v-model.number="toBase" type="number" min="2" max="36" class="base-in" />
          </label>
          <button type="button" class="action-btn" @click="convert">Convert</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <div class="tool-help">
      <h2>Integer bases 2–36</h2>
      <p>Uses arbitrary-precision integers (<code>BigInt</code>) so large values stay exact. Letters are case-insensitive; negative sign is supported.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { parseBigIntBase, formatBigIntBase } from '../utils/numberBase.js'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')
const fromBase = ref(10)
const toBase = ref(16)

const convert = () => {
  try {
    const fb = Math.floor(Number(fromBase.value))
    const tb = Math.floor(Number(toBase.value))
    if (fb < 2 || fb > 36 || tb < 2 || tb > 36) {
      status.value = 'Base must be 2–36'
      outputText.value = ''
      return
    }
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Empty input'
      return
    }
    const n = parseBigIntBase(inputText.value, fb)
    outputText.value = formatBigIntBase(n, tb)
    status.value = `Converted base ${fb} → ${tb}`
    trackToolUse('number_base', 'convert')
  } catch (e) {
    outputText.value = ''
    status.value = String(e.message || e)
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'number_base' })
    alert('Copied!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>

<style scoped>
.nb-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  padding: 0 15px;
}

.nb-input {
  min-height: 140px;
}

.bases {
  flex-wrap: wrap;
  align-items: center;
}

.base-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: #64748b;
}

.app.dark .base-field {
  color: #94a3b8;
}

.base-in {
  width: 3.25rem;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #2c3e50;
}

.app.dark .base-in {
  background: #111827;
  border-color: #374151;
  color: #f8f8f8;
}

@media (max-width: 768px) {
  .nb-layout {
    flex-direction: column;
    padding: 0 10px;
  }
}
</style>
