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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About radix (base) conversion</h2>
      <p>
        Developers routinely move between decimal, hexadecimal, and binary when debugging protocols, bitmask enums, or embedded register maps.
        JavaScript’s <code>parseInt</code> and <code>toString</code> helpers lose precision once integers exceed <code>Number.MAX_SAFE_INTEGER</code>,
        so this tool uses <code>BigInt</code> arithmetic to keep every digit exact from base 2 through base 36.
      </p>
      <p>
        Digits beyond nine use letters <code>a–z</code> case-insensitively, matching conventions from cryptography tooling and assembly listings.
        Negative values are supported with a leading minus sign.
      </p>

      <h2>Ideal use cases</h2>
      <ul>
        <li>Converting 256-bit constants from hex to decimal for documentation.</li>
        <li>Translating custom alphabets used in URL shorteners (base 36).</li>
        <li>Teaching computer science students how positional numeral systems generalize.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Enter an integer string valid in the source base (no fractional part).</li>
        <li>Set <strong>From base</strong> and <strong>To base</strong> between 2 and 36.</li>
        <li>Click <strong>Convert</strong> to compute the exact BigInt result.</li>
        <li>Copy the output for use in code, spreadsheets, or tickets.</li>
      </ol>

      <h2>Limitations</h2>
      <p>
        Non-integers, scientific notation, and bases above 36 are intentionally unsupported to keep validation predictable.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Why BigInt?</dt>
        <dd>It avoids silent rounding errors that plague floating-point conversions on large integers.</dd>
        <dt>Can I paste underscores?</dt>
        <dd>Not currently—strip separators before converting.</dd>
        <dt>Is work done on a server?</dt>
        <dd>No. Parsing and formatting execute locally.</dd>
        <dt>How are invalid digits reported?</dt>
        <dd>The status line shows an error naming the offending character and base.</dd>
      </dl>
    </article>
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
