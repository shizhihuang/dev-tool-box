<template>
  <div class="tool-index">
    <header class="hero">
      <h1>Privacy-first dev utilities for global teams</h1>
      <p class="lead">
        JSON, YAML, CSV, Markdown, QR, timestamps, encoding &amp; regex — all executed locally in your browser.
        No accounts, no uploads: your payloads stay on your machine.
      </p>
    </header>
    <section class="grid" aria-label="All tools">
      <router-link v-for="item in tools" :key="item.to" :to="item.to" class="card">
        <h2>{{ item.title }}</h2>
        <p>{{ item.blurb }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
const tools = [
  { to: '/json-formatter', title: 'JSON Formatter', blurb: 'Format, minify, validate, sort keys, JSON → CSV.' },
  { to: '/xml-tools', title: 'XML tools', blurb: 'Format, minify, XML → JSON.' },
  { to: '/yaml-json', title: 'YAML ↔ JSON', blurb: 'Convert YAML configs to JSON and back.' },
  { to: '/csv-tools', title: 'CSV tools', blurb: 'Align columns, minify, CSV ↔ JSON.' },
  { to: '/markdown-preview', title: 'Markdown preview', blurb: 'Live preview with safe rendering.' },
  { to: '/qr-code-generator', title: 'QR code', blurb: 'Generate QR codes and download PNG.' },
  { to: '/timestamp-converter', title: 'Timestamp', blurb: 'Unix ↔ ISO ↔ local time.' },
  { to: '/image-base64', title: 'Image → Base64', blurb: 'Data URL and raw Base64 from images.' },
  { to: '/base64', title: 'Base64 text', blurb: 'Encode and decode text as Base64.' },
  { to: '/url-encode-decode', title: 'URL encode/decode', blurb: 'Encode, decode, and parse URLs.' },
  { to: '/regex-tester', title: 'Regex tester', blurb: 'Match and replace preview.' },
  { to: '/html-entities', title: 'HTML entities', blurb: 'Escape and unescape HTML entities.' },
  { to: '/uuid-generator', title: 'UUID generator', blurb: 'Batch UUID v4 with Web Crypto.' },
  { to: '/number-base-converter', title: 'Number bases', blurb: 'Convert integers between bases 2–36 (BigInt).' },
  { to: '/color-picker', title: 'Color picker', blurb: 'HEX, rgb(), hsl() for CSS.' },
]
</script>

<style scoped>
.tool-index {
  padding: 0 15px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 1.75rem;
  margin-bottom: 8px;
}

.lead {
  font-size: 1rem;
  line-height: 1.5;
  color: #64748b;
}

.app.dark .lead {
  color: #94a3b8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.card {
  display: block;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.card:hover {
  border-color: #3498db;
  box-shadow: 0 4px 14px rgba(52, 152, 219, 0.15);
}

.app.dark .card {
  border-color: #374151;
  background: #111827;
}

.card h2 {
  font-size: 1.05rem;
  margin-bottom: 6px;
  color: #3498db;
}

.card p {
  font-size: 0.9rem;
  line-height: 1.45;
  color: #475569;
}

.app.dark .card p {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .tool-index {
    padding: 0 10px 20px;
  }

  .hero h1 {
    font-size: 1.4rem;
  }
}
</style>
