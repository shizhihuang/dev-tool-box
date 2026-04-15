<template>
  <div class="tool-page img-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Image to Base64</h1>
    <div class="img-layout">
      <div class="img-side">
        <label class="file-label">
          <input type="file" accept="image/*" class="file-input" @change="onFile" />
          Choose image
        </label>
        <p class="file-meta">{{ fileName || 'No file selected' }} {{ sizeHint }}</p>
        <div v-if="previewUrl" class="thumb-wrap">
          <img :src="previewUrl" alt="Preview" class="thumb" />
        </div>
      </div>
      <div class="output-wrap img-out">
        <div class="action-bar">
          <button type="button" class="action-btn copy-btn" :disabled="!dataUrl" @click="copy(dataUrl)">Copy Data URL</button>
          <button type="button" class="action-btn copy-btn" :disabled="!pureBase64" @click="copy(pureBase64)">Copy raw Base64</button>
          <button type="button" class="action-btn" :disabled="!dataUrl" @click="clear">Clear</button>
        </div>
        <textarea class="result-text" readonly :value="dataUrl" placeholder="Data URL will appear here..."></textarea>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About image to Base64</h2>
      <p>
        Data URLs embed binary file bytes directly inside text—common in HTML email, inline icons, or quick demos.
        This utility reads an image you select from disk, converts it to a Base64 payload prefixed with the correct MIME type,
        and exposes both the full Data URL and the raw Base64 segment for APIs that expect only the encoded bytes.
      </p>
      <p>
        The preview thumbnail helps confirm you picked the right asset before you paste a multi-kilobyte string into Slack or a ticket.
        Because <code>FileReader</code> runs locally, your intellectual property never traverses our application servers as part of this conversion.
      </p>

      <h2>When this page shines</h2>
      <ul>
        <li>Generating inline assets for prototypes when a CDN is not wired up yet.</li>
        <li>Comparing encoded size across PNG versus WebP exports.</li>
        <li>Teaching teammates how MIME prefixes pair with Base64 payloads.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Click <strong>Choose image</strong> and pick a raster file from your device.</li>
        <li>Wait for the preview and Data URL field to populate.</li>
        <li>Copy either the Data URL (for CSS/HTML) or the raw Base64 (for JSON APIs).</li>
        <li>Clear when finished so the next person using the workstation does not see your asset.</li>
      </ol>

      <h2>Performance guidance</h2>
      <p>
        Large photos expand into very long strings and may lag the editor. Resize images in a dedicated tool before encoding when possible.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Do you upload my file?</dt>
        <dd>No. The browser reads bytes locally and discards them when you refresh or clear.</dd>
        <dt>Why is the string so long?</dt>
        <dd>Base64 expands binary size by roughly four thirds plus the MIME prefix.</dd>
        <dt>Can I encode SVG?</dt>
        <dd>Yes if the browser recognizes the MIME type, but remember SVG can contain scripts—only encode trusted files.</dd>
        <dt>Does this strip EXIF metadata?</dt>
        <dd>The Base64 reflects the file bytes as read; metadata embedded in the file remains unless you preprocess the image elsewhere.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const dataUrl = ref('')
const fileName = ref('')
const fileSize = ref(0)

const previewUrl = computed(() => dataUrl.value || '')

const pureBase64 = computed(() => {
  if (!dataUrl.value || !dataUrl.value.includes(',')) return ''
  return dataUrl.value.split(',')[1] || ''
})

const sizeHint = computed(() => {
  if (!fileSize.value) return ''
  const kb = (fileSize.value / 1024).toFixed(1)
  return `(${kb} KB)`
})

const onFile = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  fileName.value = file.name
  fileSize.value = file.size
  const reader = new FileReader()
  reader.onload = () => {
    dataUrl.value = typeof reader.result === 'string' ? reader.result : ''
    trackToolUse('image_base64', 'load')
  }
  reader.onerror = () => {
    dataUrl.value = ''
  }
  reader.readAsDataURL(file)
}

const clear = () => {
  dataUrl.value = ''
  fileName.value = ''
  fileSize.value = 0
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'image_base64' })
    alert('Copied!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>

<style scoped>
.img-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  padding: 0 15px;
  align-items: stretch;
}

.img-side {
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: #3498db;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  width: fit-content;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-meta {
  font-size: 0.85rem;
  color: #64748b;
}

.app.dark .file-meta {
  color: #94a3b8;
}

.thumb-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #f8fafc;
  max-height: 200px;
  overflow: hidden;
}

.app.dark .thumb-wrap {
  border-color: #374151;
  background: #111827;
}

.thumb {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.img-out {
  flex: 1;
  min-height: 220px;
}

.result-text {
  flex: 1;
  width: 100%;
  min-height: 160px;
  border: none;
  resize: none;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  background: transparent;
  color: inherit;
}

@media (max-width: 768px) {
  .img-layout {
    flex-direction: column;
    padding: 0 10px;
  }

  .img-side {
    flex: none;
  }
}
</style>
