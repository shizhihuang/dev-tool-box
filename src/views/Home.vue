<template>
  <div class="home">
    <div class="tabs">
      <button :class="{ active: tab === 'json' }" @click="setTab('json')">JSON Formatter</button>
      <button :class="{ active: tab === 'base64' }" @click="setTab('base64')">Base64 Encode/Decode</button>
      <button :class="{ active: tab === 'url' }" @click="setTab('url')">URL Encode/Decode</button>
    </div>

    <div v-if="tab === 'json'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="jsonInput" @input="formatJson" placeholder="Paste your JSON here..."></textarea>
        <button class="clear-btn" @click="jsonInput = ''; jsonOutput = ''; jsonOutputText = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn copy-btn" @click="copy(jsonOutputText, 'json')">Copy Result</button>
        </div>
        <pre v-html="jsonOutput" class="result-content"></pre>
      </div>
    </div>

    <div v-if="tab === 'base64'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="b64Input" placeholder="Paste text to encode/decode..."></textarea>
        <button class="clear-btn" @click="b64Input = ''; b64Output = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="b64Encode">Encode</button>
          <button class="action-btn" @click="b64Decode">Decode</button>
          <button class="action-btn copy-btn" @click="copy(b64Output, 'base64')">Copy Result</button>
        </div>
        <pre class="result-content">{{ b64Output }}</pre>
      </div>
    </div>

    <div v-if="tab === 'url'" class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="urlInput" placeholder="Paste URL to encode/decode..."></textarea>
        <button class="clear-btn" @click="urlInput = ''; urlOutput = ''">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="urlEncode">Encode</button>
          <button class="action-btn" @click="urlDecode">Decode</button>
          <button class="action-btn copy-btn" @click="copy(urlOutput, 'url')">Copy Result</button>
        </div>
        <pre class="result-content">{{ urlOutput }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackTabSelect, trackToolUse, trackEvent } from '../utils/analytics.js'

const tab = ref('json')
const setTab = (t) => {
  tab.value = t
  trackTabSelect(t)
}

const jsonInput = ref('')
const jsonOutput = ref('')
const jsonOutputText = ref('')
const formatJson = () => {
  try {
    if (!jsonInput.value) {
      jsonOutput.value = ''
      jsonOutputText.value = ''
      return
    }
    const obj = JSON.parse(jsonInput.value)
    const str = JSON.stringify(obj, null, 2)
    jsonOutputText.value = str
    jsonOutput.value = str
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+(\.\d+)?)/g, ': <span class="num">$1</span>')
      .replace(/: (true|false)/g, ': <span class="bool">$1</span>')
      .replace(/: (null)/g, ': <span class="null">$1</span>')
  } catch (e) {
    jsonOutput.value = '<span class="error">Invalid JSON format</span>'
    jsonOutputText.value = ''
  }
}

const b64Input = ref('')
const b64Output = ref('')
const b64Encode = () => {
  try {
    b64Output.value = btoa(unescape(encodeURIComponent(b64Input.value)))
    trackToolUse('base64', 'encode')
  } catch (e) {
    b64Output.value = 'Error: Invalid input'
  }
}
const b64Decode = () => {
  try {
    b64Output.value = decodeURIComponent(escape(atob(b64Input.value)))
    trackToolUse('base64', 'decode')
  } catch (e) {
    b64Output.value = 'Error: Invalid Base64 string'
  }
}

const urlInput = ref('')
const urlOutput = ref('')
const urlEncode = () => {
  try {
    urlOutput.value = encodeURIComponent(urlInput.value)
    trackToolUse('url', 'encode')
  } catch (e) {
    urlOutput.value = 'Error: Invalid input'
  }
}
const urlDecode = () => {
  try {
    urlOutput.value = decodeURIComponent(urlInput.value)
    trackToolUse('url', 'decode')
  } catch (e) {
    urlOutput.value = 'Error: Invalid URL encoded string'
  }
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

<style>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  height: 40px;
  padding: 0 15px;
  flex-shrink: 0;
}
.tabs button {
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  color: #2c3e50;
  cursor: pointer;
  font-size: 0.9rem;
}
.tabs button.active {
  background: #3498db;
  color: white;
}
.app.dark .tabs button {
  background: #333;
  color: #f8f8f8;
}
.app.dark .tabs button.active {
  background: #3498db;
}

.tool-layout {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  padding: 0 15px;
}
.input-wrap {
  flex: 1;
  position: relative;
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  min-height: 0;
}
.app.dark .input-wrap {
  border-color: #444;
}
.input-wrap textarea {
  width: 100%;
  height: 100%;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
  resize: none;
  background: #f8f9fa;
  color: #2c3e50;
}
.app.dark .input-wrap textarea {
  background: #2c2c2c;
  color: #f8f8f8;
}
.clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  font-size: 0.8rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}
.output-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px;
  background: #f8f9fa;
  min-height: 0;
}
.app.dark .output-wrap {
  border-color: #444;
  background: #2c2c2c;
}
.action-bar {
  display: flex;
  gap: 10px;
  height: 40px;
}
.action-btn {
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}
.copy-btn {
  background: #9b59b6 !important;
}
.app.dark .action-btn {
  background: #27ae60;
}
.app.dark .copy-btn {
  background: #8e44ad !important;
}
.result-content {
  flex: 1;
  padding: 10px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: #2c3e50;
}
.app.dark .result-content {
  color: #f8f8f8;
}
.key { color: #2980b9 !important; font-weight: bold !important; }
.str { color: #27ae60 !important; }
.num { color: #e67e22 !important; }
.bool { color: #8e44ad !important; }
.null { color: #7f8c8d !important; }
.error { color: #e74c3c !important; font-weight: bold !important; }

@media (max-width: 768px) {
  .tabs {
    height: auto;
    margin-bottom: 10px;
    padding: 0 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tabs button {
    flex: 0 0 auto;
    padding: 0 14px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .tool-layout {
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;
  }
  .input-wrap, .output-wrap {
    flex: 1;
    height: auto;
    min-height: 0;
  }

  .input-wrap textarea {
    padding: 12px;
    font-size: 0.9rem;
  }

  .output-wrap {
    padding: 8px;
  }

  .action-bar {
    height: 36px;
    gap: 8px;
  }
  .action-btn {
    padding: 0 14px;
    font-size: 0.85rem;
  }

  .clear-btn {
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .result-content {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>
