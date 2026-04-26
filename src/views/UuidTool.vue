<template>
  <div class="tool-page uuid-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>UUID Generator</h1>
    <div class="uuid-layout">
      <div class="output-wrap uuid-controls">
        <div class="action-bar row-wrap">
          <label class="field">
            Count
            <input v-model.number="count" type="number" min="1" max="100" class="num-in" />
          </label>
          <label class="field check">
            <input v-model="uppercase" type="checkbox" />
            Uppercase
          </label>
          <button type="button" class="action-btn" @click="generate">Generate</button>
          <button type="button" class="action-btn copy-btn" :disabled="!outputText" @click="copy(outputText)">Copy all</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content uuid-out">{{ outputText || 'Click Generate.' }}</pre>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About UUID version 4</h2>
      <p>
        Universally unique identifiers remove coordination overhead when databases need primary keys or when microservices must
        correlate events without a central allocator. Version 4 IDs are random (with reserved version and variant bits), making
        collisions astronomically unlikely for practical engineering purposes.
      </p>
      <p>
        This generator prefers <code>crypto.randomUUID()</code> when the browser exposes it, falls back to <code>getRandomValues</code>,
        and only then uses a Math-based generator clearly labeled as non-cryptographic. You can emit up to one hundred IDs per batch
        and optionally uppercase them for systems that require uppercase hex.
      </p>

      <h2>When batch generation helps</h2>
      <ul>
        <li>Seeding integration tests with deterministic-looking but unique identifiers.</li>
        <li>Provisioning temporary filenames for offline demos.</li>
        <li>Generating correlation IDs for log pipelines during load tests.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Set the desired count (1–100).</li>
        <li>Toggle <strong>Uppercase</strong> if downstream systems require uppercase hex digits.</li>
        <li>Click <strong>Generate</strong> to populate the output pane.</li>
        <li>Copy the block into spreadsheets, fixtures, or shell scripts.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        IDs are created locally. They are not logged by this tool, although your browser extensions or analytics may still record page views normally.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Are these IDs cryptographically secure?</dt>
        <dd>When Web Crypto is available, yes for typical engineering threat models. Avoid the Math fallback for secrets.</dd>
        <dt>Can I generate ULIDs?</dt>
        <dd>Not on this page—UUID v4 only.</dd>
        <dt>Why limit batches to 100?</dt>
        <dd>It keeps the UI responsive and discourages accidental thousand-line pastes into editors.</dd>
        <dt>Do UUIDs leak entropy?</dt>
        <dd>They reveal nothing beyond random bits; still, do not embed sequential business identifiers if those must stay private.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const count = ref(5)
const uppercase = ref(false)
const outputText = ref('')
const status = ref('Ready')

const generate = () => {
  let n = Math.min(100, Math.max(1, Math.floor(Number(count.value) || 1)))
  const lines = []
  for (let i = 0; i < n; i++) {
    let id
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      id = crypto.randomUUID()
    } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      id = uuidFromRandomValues()
    } else {
      id = insecureUuidV4()
    }
    lines.push(uppercase.value ? id.toUpperCase() : id)
  }
  outputText.value = lines.join('\n')
  status.value = `Generated ${n} UUID(s)`
  trackToolUse('uuid', 'generate')
}

function uuidFromRandomValues() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Last resort (not cryptographically strong). */
function insecureUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'uuid' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>

<style scoped>
.uuid-layout {
  padding: 0 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.uuid-controls {
  flex: 1;
  min-height: 200px;
}

.row-wrap {
  flex-wrap: wrap;
  align-items: center;
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
}

.app.dark .field {
  color: #94a3b8;
}

.field.check {
  gap: 6px;
}

.num-in {
  width: 4rem;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #2c3e50;
}

.app.dark .num-in {
  background: #111827;
  border-color: #374151;
  color: #f8f8f8;
}

.uuid-out {
  font-size: 0.88rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .uuid-layout {
    padding: 0 10px;
  }
}
</style>
