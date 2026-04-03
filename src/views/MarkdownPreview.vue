<template>
  <div class="tool-page md-tool">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>Markdown Preview</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="source" placeholder="# Write Markdown here..."></textarea>
        <button type="button" class="clear-btn" @click="source = ''">Clear</button>
      </div>
      <div class="output-wrap preview-out">
        <div class="action-bar">
          <button type="button" class="action-btn copy-btn" @click="copyHtml">Copy HTML</button>
        </div>
        <div class="md-preview" v-html="html"></div>
      </div>
    </div>
    <div class="tool-help">
      <h2>Markdown Preview</h2>
      <p>Live preview with line breaks and auto-linked URLs. Raw HTML in source is disabled for safety.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { trackEvent } from '../utils/analytics.js'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const source = ref('')

const html = computed(() => (source.value ? md.render(source.value) : '<p class="md-empty">Preview appears here.</p>'))

const copyHtml = () => {
  const out = md.render(source.value)
  if (!out.trim()) return
  navigator.clipboard.writeText(out).then(() => {
    trackEvent('copy', { tool: 'markdown' })
    alert('HTML copied!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>

<style scoped>
.preview-out {
  min-height: 200px;
}

.md-preview {
  flex: 1;
  overflow: auto;
  padding: 12px 14px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #2c3e50;
}

.app.dark .md-preview {
  color: #f8f8f8;
}

.md-preview :deep(h1),
.md-preview :deep(h2),
.md-preview :deep(h3) {
  margin: 0.6em 0 0.35em;
  font-weight: 700;
}

.md-preview :deep(h1) {
  font-size: 1.35rem;
}

.md-preview :deep(h2) {
  font-size: 1.15rem;
}

.md-preview :deep(p) {
  margin: 0.5em 0;
}

.md-preview :deep(ul),
.md-preview :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.25rem;
}

.md-preview :deep(code) {
  font-family: 'Courier New', monospace;
  background: #eef2f7;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.88em;
}

.app.dark .md-preview :deep(code) {
  background: #374151;
}

.md-preview :deep(pre) {
  background: #f1f5f9;
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  margin: 0.6em 0;
}

.app.dark .md-preview :deep(pre) {
  background: #111827;
}

.md-preview :deep(pre code) {
  background: transparent;
  padding: 0;
}

.md-preview :deep(a) {
  color: #3498db;
}

.md-preview :deep(blockquote) {
  margin: 0.6em 0;
  padding-left: 12px;
  border-left: 3px solid #cbd5e1;
  color: #64748b;
}

.app.dark .md-preview :deep(blockquote) {
  border-color: #475569;
  color: #94a3b8;
}

.md-empty {
  color: #94a3b8;
  margin: 0;
}
</style>
