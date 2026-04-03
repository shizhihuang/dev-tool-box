<template>
  <div class="tool-page qr-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>QR Code Generator</h1>
    <div class="qr-layout">
      <div class="input-wrap qr-input">
        <textarea v-model="text" placeholder="URL or text to encode..."></textarea>
        <button type="button" class="clear-btn" @click="text = ''; dataUrl = ''">Clear</button>
      </div>
      <div class="qr-panel output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="generate">Generate</button>
          <button type="button" class="action-btn copy-btn" :disabled="!dataUrl" @click="downloadPng">Download PNG</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <div class="qr-canvas-wrap">
          <img v-if="dataUrl" :src="dataUrl" alt="QR code" class="qr-img" />
          <p v-else class="qr-placeholder">Generated QR appears here.</p>
        </div>
      </div>
    </div>
    <div class="tool-help">
      <h2>QR Code</h2>
      <p>Creates a PNG data URL locally. Longer text may require a denser QR version.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { trackToolUse } from '../utils/analytics.js'

const text = ref('')
const dataUrl = ref('')
const status = ref('Ready')

const generate = async () => {
  if (!text.value.trim()) {
    dataUrl.value = ''
    status.value = 'Enter text or URL'
    return
  }
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      margin: 2,
      width: 280,
      color: { dark: '#111827', light: '#ffffff' },
    })
    status.value = 'Generated'
    trackToolUse('qr', 'generate')
  } catch (e) {
    dataUrl.value = ''
    status.value = 'Failed to generate'
  }
}

watch(text, () => {
  if (!text.value.trim()) {
    dataUrl.value = ''
    status.value = 'Ready'
  }
})

const downloadPng = () => {
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = 'qrcode.png'
  a.click()
  trackToolUse('qr', 'download')
}
</script>

<style scoped>
.qr-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  padding: 0 15px;
}

.qr-input {
  min-height: 220px;
}

.qr-panel {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 320px;
}

.qr-canvas-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}

.app.dark .qr-canvas-wrap {
  background: #111827;
}

.qr-img {
  max-width: 100%;
  height: auto;
  image-rendering: pixelated;
}

.qr-placeholder {
  color: #94a3b8;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .qr-layout {
    flex-direction: column;
    padding: 0 10px;
  }

  .qr-panel {
    max-width: none;
  }
}
</style>
