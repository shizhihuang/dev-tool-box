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

    <section class="guides-section" aria-label="Learning guides">
      <h2>Guides for real workflows</h2>
      <p class="guides-lead">
        Start with short tutorials when you need practical context, not just buttons.
      </p>
      <div class="guides-links">
        <router-link to="/guides/json-formatting-best-practices">JSON formatting best practices</router-link>
        <router-link to="/guides/base64-encoding-guide">Base64 encoding guide</router-link>
        <router-link to="/guides/url-encoding-explained">URL encoding explained</router-link>
        <router-link to="/guides/regex-for-developers">Regex for developers</router-link>
        <router-link to="/guides/csv-json-conversion">CSV and JSON conversion</router-link>
        <router-link to="/guides/unix-timestamp-guide">Unix timestamp guide</router-link>
      </div>
    </section>

    <article class="home-article" lang="en" aria-labelledby="home-article-title">
      <h2 id="home-article-title">What Fast Toolkit is</h2>
      <p>
        Fast Toolkit is an editorially maintained collection of browser-based utilities for software engineers, site reliability engineers,
        technical writers, and curious makers. Each tool page explains not only which buttons to press but also why the operation matters,
        how your data stays on-device, and which limitations you should plan for when you move work back into production systems.
      </p>
      <p>
        We built the suite around a simple promise: <strong>no accounts, no uploads of your payloads to our application servers</strong>.
        Parsing, formatting, rendering, and conversions execute with JavaScript inside your tab. That design supports sensitive workflows such as
        inspecting JSON from a private API or converting a customer’s CSV excerpt—as long as you still follow your employer’s data-handling policies
        and clear the page when you finish on a shared computer.
      </p>

      <h2>How we choose what to ship</h2>
      <p>
        Every utility solves a narrow problem we have hit repeatedly in real shipping work: messy JSON from logs, YAML copied out of Kubernetes,
        Markdown drafts that need a quick preview, QR codes for staging environments, timestamps pulled from distributed traces, and so on.
        We document edge cases directly on the page so you can decide whether this site or a heavier desktop tool is the right fit.
      </p>

      <h2>Using this site responsibly</h2>
      <ul>
        <li>Read the per-tool FAQ before you paste regulated data—even local tools cannot stop shoulder surfing.</li>
        <li>Prefer dedicated secret managers for long-lived credentials; never treat Base64 or QR codes as encryption.</li>
        <li>Combine these utilities with your normal code review, linting, and automated tests—think of Fast Toolkit as a notebook, not a compiler.</li>
      </ul>

      <h2>Transparency &amp; ads</h2>
      <p>
        We may display Google AdSense or similar placements to fund hosting and ongoing improvements. Ads are configured to avoid intrusive formats
        wherever possible, and we publish a Privacy Policy describing analytics cookies. Tool logic still runs locally; advertising is orthogonal to your input.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="home-faq">
        <dt>Do you store what I paste into the tools?</dt>
        <dd>No. The tools are implemented as client-side scripts. Third-party analytics may record page views as described in our Privacy Policy.</dd>
        <dt>Can I use Fast Toolkit offline?</dt>
        <dd>After the first load, some browsers may cache assets, but you should assume network access is required unless you self-host the build.</dd>
        <dt>How do I request a new tool?</dt>
        <dd>Email hello@fasttoolkit.dev with a short user story—we read every message even if we cannot commit to a timeline.</dd>
        <dt>Is commercial use allowed?</dt>
        <dd>Yes, subject to any license file shipped with the repository if you fork the open-source build.</dd>
        <dt>Why English copy?</dt>
        <dd>English keeps guidance accessible to the widest international engineering audience while we iterate on localization.</dd>
      </dl>
    </article>
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

.guides-section {
  margin-top: 22px;
  padding: 16px;
  border: 1px solid #dfe6e9;
  border-radius: 10px;
  background: #f8fafc;
}
.guides-section h2 {
  font-size: 1.2rem;
  margin-bottom: 6px;
}
.guides-lead {
  margin-bottom: 10px;
  color: #475569;
}
.guides-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 14px;
}
.guides-links a {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.93rem;
}
.guides-links a:hover {
  text-decoration: underline;
}
.app.dark .guides-section {
  border-color: #374151;
  background: #111827;
}
.app.dark .guides-lead {
  color: #cbd5e1;
}

.home-article {
  margin-top: 28px;
  padding: 22px 18px 28px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #1e293b;
  text-align: left;
}

.app.dark .home-article {
  border-color: #374151;
  background: #0f172a;
  color: #e2e8f0;
}

.home-article h2 {
  font-size: 1.15rem;
  margin: 1.35rem 0 0.55rem;
  color: #0f172a;
}

.home-article h2:first-of-type {
  margin-top: 0;
}

.app.dark .home-article h2 {
  color: #f8fafc;
}

.home-article p {
  margin: 0 0 0.85rem;
}

.home-article ul {
  margin: 0.35rem 0 1rem 1.25rem;
}

.home-faq {
  margin: 0.5rem 0 0;
}

.home-faq dt {
  font-weight: 600;
  margin-top: 0.95rem;
}

.home-faq dt:first-child {
  margin-top: 0.35rem;
}

.home-faq dd {
  margin: 0.35rem 0 0 0;
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
