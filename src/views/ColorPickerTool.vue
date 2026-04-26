<template>
  <div class="tool-page color-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Color Picker</h1>
    <div class="color-layout">
      <div class="picker-card output-wrap">
        <div class="picker-row">
          <input v-model="hex" type="color" class="color-native" aria-label="Pick color" @input="onNativeInput" />
          <div class="swatch" :style="{ backgroundColor: normalizedHex }" />
        </div>
        <label class="hex-row">
          Hex
          <input v-model="hexInput" class="hex-text" spellcheck="false" @change="applyHexInput" />
        </label>
        <ul class="channels">
          <li v-for="row in rows" :key="row.label">
            <span class="ch-label">{{ row.label }}</span>
            <code class="ch-val">{{ row.value }}</code>
            <button type="button" class="mini-copy" @click="copy(row.value)">Copy</button>
          </li>
        </ul>
        <p class="hint">{{ status }}</p>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About this color picker</h2>
      <p>
        Designers and front-end engineers constantly translate between HEX swatches from brand guidelines, <code>rgb()</code> tuples from design tokens,
        and <code>hsl()</code> values when tweaking lightness in CSS. This page centralizes those conversions with a native color input for fast exploration
        plus text fields for precise edits.
      </p>
      <p>
        The picker normalizes shorthand HEX (three-digit) into six-digit lowercase form so downstream tools receive predictable strings.
        RGB output uses 8-bit channels; HSL values are rounded integers suitable for quick prototyping even though design tools may show decimals.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>Copying ready-to-paste CSS color functions from a brand HEX.</li>
        <li>Checking contrast pairs by bouncing between HEX and HSL lightness.</li>
        <li>Teaching how sRGB hex maps to cylindrical HSL coordinates.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Drag the native color thumb or paste a HEX string into the text field.</li>
        <li>Confirm the swatch matches your intent.</li>
        <li>Copy HEX, <code>rgb()</code>, or <code>hsl()</code> using the per-row buttons.</li>
      </ol>

      <h2>Color science caveats</h2>
      <p>
        This tool operates in sRGB space like most web canvases. It does not model wide-gamut displays or OKLCH unless you extend the code separately.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Does it support alpha channels?</dt>
        <dd>Not in this UI—opaque colors only.</dd>
        <dt>Why does HSL differ slightly from Figma?</dt>
        <dd>Rounding and gamut assumptions differ across implementations; treat values as starting points.</dd>
        <dt>Is anything uploaded?</dt>
        <dd>No. Colors stay inside the browser tab.</dd>
        <dt>Can I enter hsl manually?</dt>
        <dd>Currently you drive the picker via HEX or the native control; extend the app if you need reverse parsing.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const hex = ref('#3498db')
const hexInput = ref('#3498db')
const status = ref('Ready')

const normalizedHex = computed(() => normalizeHex(hex.value))

watch(
  hex,
  (v) => {
    hexInput.value = normalizeHex(v)
  },
  { immediate: true },
)

function normalizeHex(h) {
  let s = (h || '#000000').trim()
  if (!s.startsWith('#')) s = `#${s}`
  s = s.slice(0, 7)
  if (s.length === 4) {
    const r = s[1]
    const g = s[2]
    const b = s[3]
    s = `#${r}${r}${g}${g}${b}${b}`
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(s)) return '#000000'
  return s.toLowerCase()
}

function onNativeInput() {
  hexInput.value = normalizeHex(hex.value)
  trackToolUse('color_picker', 'pick')
}

function applyHexInput() {
  const n = normalizeHex(hexInput.value)
  hex.value = n
  hexInput.value = n
  trackToolUse('color_picker', 'hex_input')
}

const rgb = computed(() => hexToRgb(normalizedHex.value))

const hsl = computed(() => rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b))

const rows = computed(() => {
  const { r, g, b } = rgb.value
  const { h, s, l } = hsl.value
  return [
    { label: 'HEX', value: normalizedHex.value },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
  ]
})

function hexToRgb(hexStr) {
  const h = hexStr.replace('#', '')
  const n = parseInt(h, 16)
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      default:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'color_picker' })
    status.value = 'Copied'
    setTimeout(() => {
      status.value = 'Ready'
    }, 1200)
  }).catch(() => {
    status.value = 'Copy failed'
  })
}
</script>

<style scoped>
.color-layout {
  padding: 0 15px 10px;
  max-width: 480px;
}

.picker-card {
  gap: 14px;
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.color-native {
  width: 64px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.swatch {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.app.dark .swatch {
  border-color: #374151;
}

.hex-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #64748b;
}

.app.dark .hex-row {
  color: #94a3b8;
}

.hex-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #2c3e50;
}

.app.dark .hex-text {
  background: #111827;
  border-color: #374151;
  color: #f8f8f8;
}

.channels {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channels li {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 0.88rem;
}

.ch-label {
  color: #64748b;
}

.app.dark .ch-label {
  color: #94a3b8;
}

.ch-val {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  word-break: break-all;
  background: #f1f5f9;
  padding: 6px 8px;
  border-radius: 6px;
  color: #0f172a;
}

.app.dark .ch-val {
  background: #111827;
  color: #e2e8f0;
}

.mini-copy {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #9b59b6;
  color: #fff;
  cursor: pointer;
  font-size: 0.78rem;
}

.hint {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
}
</style>
