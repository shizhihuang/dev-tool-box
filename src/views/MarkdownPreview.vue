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
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About this Markdown preview</h2>
      <p>
        Markdown is the default authoring format for README files, internal wikis, and static site generators.
        This page renders your source into HTML in real time so you can proof headings, lists, fenced code blocks, and links
        before you publish to GitHub, Notion, or a documentation pipeline.
      </p>
      <p>
        We intentionally disable raw HTML in the Markdown source. That choice reduces XSS risk when you paste untrusted snippets
        and mirrors how many hosted platforms sanitize user content. Auto-linking and hard line breaks remain enabled for developer ergonomics.
      </p>

      <h2>Great use cases</h2>
      <ul>
        <li>Reviewing release notes or changelog drafts with accurate code highlighting.</li>
        <li>Checking that relative links resolve the way you expect before pushing to a repo.</li>
        <li>Teaching teammates Markdown syntax with instant visual feedback.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Author Markdown in the left editor using your normal shortcuts.</li>
        <li>Watch the right pane update as you type—scroll independently when working on long documents.</li>
        <li>Use <strong>Copy HTML</strong> when a CMS or email client needs sanitized HTML instead of Markdown.</li>
      </ol>

      <h2>Limitations</h2>
      <p>
        GitHub-flavored extensions such as tables or task lists follow the Markdown-it defaults you configured in code; exotic
        plugins are not loaded here. For GitHub-specific previews, still run a final check on GitHub itself.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Why is my HTML snippet showing as text?</dt>
        <dd>Raw HTML is escaped for safety. Rely on Markdown constructs or preprocess trusted HTML elsewhere.</dd>
        <dt>Does the preview send my document to a server?</dt>
        <dd>No. Markdown-it runs locally inside your tab.</dd>
        <dt>Can I export PDFs?</dt>
        <dd>Not from this page—use print-to-PDF in the browser if you need a snapshot.</dd>
        <dt>Are images supported?</dt>
        <dd>Remote image URLs render if you allow network access from the hosting page; large images depend on browser networking policies.</dd>
      </dl>
    </article>
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
