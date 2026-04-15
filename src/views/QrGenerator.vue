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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About this QR code generator</h2>
      <p>
        QR codes bridge physical and digital experiences—event badges, Wi-Fi setup cards, marketing flyers, or factory labels.
        This generator renders a PNG data URL entirely in your browser so you can iterate on payload length, download the bitmap,
        and drop it into design tools without installing native apps.
      </p>
      <p>
        QR versions scale automatically with the amount of data. Very long strings increase module density, which may require
        higher print quality for reliable scans. Test printed codes with multiple devices before large campaigns.
      </p>

      <h2>Recommended scenarios</h2>
      <ul>
        <li>Encoding HTTPS URLs for storefront signage.</li>
        <li>Embedding short JSON payloads for internal tooling prototypes.</li>
        <li>Generating one-off codes for staging environments where email is unavailable.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Type or paste the text or URL you want encoded.</li>
        <li>Click <strong>Generate</strong> to build a PNG preview.</li>
        <li>Use <strong>Download PNG</strong> when the preview looks correct.</li>
        <li>Clear the textarea between customer demos to avoid leaking prior payloads.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        The QR library executes locally. No QR payload is transmitted to Fast Toolkit servers as part of the generation step.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Can I customize colors?</dt>
        <dd>This UI uses fixed dark-on-light colors for maximum contrast. Adjust in source if you need branded palettes.</dd>
        <dt>Does it support Wi-Fi QR strings?</dt>
        <dd>Yes, paste the full <code>WIFI:</code> schema string and generate like any other text.</dd>
        <dt>Why did generation fail?</dt>
        <dd>Extremely large inputs or unsupported characters may exceed library limits. Shorten the payload or split data.</dd>
        <dt>Is there analytics on the QR content?</dt>
        <dd>No. Only your normal site analytics run; the QR text itself is not uploaded by this tool.</dd>
      </dl>
    </article>
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
