
<template>
  <div class="app" :class="{ dark: isDark }">
    <!-- 顶部 -->
    <div class="header">
      <h1>Dev Tool Box</h1>
      <button class="theme-btn" @click="toggleTheme">
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </div>

    <!-- Tab -->
    <div class="tabs">
      <button :class="{ active: tab === 'json' }" @click="setTab('json')">JSON Formatter</button>
      <button :class="{ active: tab === 'base64' }" @click="setTab('base64')">Base64 Encode/Decode</button>
      <button :class="{ active: tab === 'url' }" @click="setTab('url')">URL Encode/Decode</button>
    </div>

    <!-- JSON 工具 -->
    <div v-if="tab === 'json'" class="tool-layout">
      <!-- 左侧输入 -->
      <div class="input-wrap">
        <textarea v-model="jsonInput" @input="formatJson" placeholder="Paste your JSON here..."></textarea>
        <button class="clear-btn" @click="jsonInput = ''; jsonOutput = ''; jsonOutputText = ''">Clear</button>
      </div>
      <!-- 右侧操作+结果 -->
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn copy-btn" @click="copy(jsonOutputText, 'json')">Copy Result</button>
        </div>
        <pre v-html="jsonOutput" class="result-content"></pre>
      </div>
    </div>

    <!-- Base64 工具 -->
    <div v-if="tab === 'base64'" class="tool-layout">
      <!-- 左侧输入 -->
      <div class="input-wrap">
        <textarea v-model="b64Input" placeholder="Paste text to encode/decode..."></textarea>
        <button class="clear-btn" @click="b64Input = ''; b64Output = ''">Clear</button>
      </div>
      <!-- 右侧操作+结果 -->
      <div class="output-wrap">
        <div class="action-bar">
          <button class="action-btn" @click="b64Encode">Encode</button>
          <button class="action-btn" @click="b64Decode">Decode</button>
          <button class="action-btn copy-btn" @click="copy(b64Output, 'base64')">Copy Result</button>
        </div>
        <pre class="result-content">{{ b64Output }}</pre>
      </div>
    </div>

    <!-- URL 工具 -->
    <div v-if="tab === 'url'" class="tool-layout">
      <!-- 左侧输入 -->
      <div class="input-wrap">
        <textarea v-model="urlInput" placeholder="Paste URL to encode/decode..."></textarea>
        <button class="clear-btn" @click="urlInput = ''; urlOutput = ''">Clear</button>
      </div>
      <!-- 右侧操作+结果 -->
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
import { trackTabSelect, trackToolUse, trackEvent } from './utils/analytics.js'

// 基础状态
const isDark = ref(false)
const tab = ref('json')
const setTab = (t) => {
  tab.value = t
  trackTabSelect(t)
}
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// JSON
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

// Base64
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

// URL
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

// 复制
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
/* 全局重置 - 彻底移除所有默认边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100vw;  /* 视口宽度100% */
  height: 100vh; /* 视口高度100% */
  overflow-x: hidden;
}

/* 核心容器 - 完全全屏，无任何限制（按你的调整） */
.app {
  width: 100vw;
  height: 100vh;
  /* 移除max-width和多余padding，仅保留少量上下内边距避免贴顶 */
  padding: 15px;
  font-family: 'Arial', sans-serif;
  background: #ffffff;
  transition: background 0.3s, color 0.3s;
}

/* 深色模式 */
.app.dark {
  background: #1a1a1a;
  color: #f8f8f8;
}

/* 顶部 - 加左右15px间距避免贴边 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  height: 60px;
  padding: 0 15px;
}
.header h1 {
  font-size: 2rem;
  color: #2c3e50;
}
.app.dark .header h1 {
  color: #f8f8f8;
}
.theme-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  cursor: pointer;
  font-size: 0.9rem;
}
.app.dark .theme-btn {
  background: #333;
  color: #f8f8f8;
}

/* Tab栏 - 加左右15px间距 */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  height: 40px;
  padding: 0 15px;
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

/* 所有工具统一的左右分栏布局 - 核心！ */
.tool-layout {
  display: flex;
  gap: 15px;
  width: 100%;
  height: calc(100vh - 140px); /* 减去顶部+Tab栏高度，占满剩余屏幕 */
  padding: 0 15px; /* 仅这里加左右间距，内容不贴边 */
  overflow: hidden; /* 防止子元素把整体高度撑大，只在内部滚动 */
}

/* 左侧输入框容器 - 占50%宽度 */
.input-wrap {
  flex: 1;
  position: relative;
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  min-height: 0; /* 允许在父 flex 容器中被约束高度，内部滚动 */
}
.app.dark .input-wrap {
  border-color: #444;
}

/* 输入框 - 100%占满容器 */
textarea {
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
.app.dark textarea {
  background: #2c2c2c;
  color: #f8f8f8;
}

/* 清空按钮 */
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

/* 右侧输出容器 - 占50%宽度 */
.output-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px;
  background: #f8f9fa;
  min-height: 0; /* 允许内部 .result-content 自己滚动，而不是撑开整体 */
}
.app.dark .output-wrap {
  border-color: #444;
  background: #2c2c2c;
}

/* 操作按钮栏 */
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

/* 结果内容区 - 占满剩余高度 */
.result-content {
  flex: 1;
  padding: 10px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  white-space: pre-wrap; /* 保留格式但允许自动换行 */
  word-break: break-all; /* 长的Base64/URL字符串也会换行 */
  color: #2c3e50;
}
.app.dark .result-content {
  color: #f8f8f8;
}

/* JSON高亮样式 */
.key { color: #2980b9 !important; font-weight: bold !important; }
.str { color: #27ae60 !important; }
.num { color: #e67e22 !important; }
.bool { color: #8e44ad !important; }
.null { color: #7f8c8d !important; }
.error { color: #e74c3c !important; font-weight: bold !important; }

/* 仅小屏（手机）才切换为上下布局 */
@media (max-width: 768px) {
  .tool-layout {
    flex-direction: column;
    height: calc(100vh - 120px);
  }
  .input-wrap, .output-wrap {
    flex: none;
    height: 50%;
  }
}
</style>