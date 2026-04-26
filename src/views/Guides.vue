<template>
  <div class="page-content">
    <h1>Developer Guides</h1>
    <p class="intro">
      Practical, copy-and-use tutorials for common data formatting and debugging tasks. All examples are designed for
      real engineering workflows and map directly to Fast Toolkit utilities.
    </p>

    <section class="guide-grid">
      <router-link v-for="guide in guides" :key="guide.to" :to="guide.to" class="guide-card">
        <h2>{{ guide.title }}</h2>
        <p>{{ guide.blurb }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
const guides = [
  {
    to: '/guides/json-formatting-best-practices',
    title: 'JSON Formatting Best Practices',
    blurb: 'Validate, format, sort keys, and avoid common JSON mistakes in APIs and logs.',
  },
  {
    to: '/guides/base64-encoding-guide',
    title: 'Base64 Encoding Guide',
    blurb: 'When to encode, when not to, and safe ways to debug Base64 in production systems.',
  },
  {
    to: '/guides/url-encoding-explained',
    title: 'URL Encoding Explained',
    blurb: 'Understand query encoding, reserved characters, and debugging malformed redirect links.',
  },
  {
    to: '/guides/regex-for-developers',
    title: 'Regex for Developers',
    blurb: 'Build safer patterns, test flags, and reduce catastrophic matching mistakes.',
  },
  {
    to: '/guides/csv-json-conversion',
    title: 'CSV and JSON Conversion',
    blurb: 'Move data between spreadsheets and APIs while preserving structure and escaping rules.',
  },
  {
    to: '/guides/unix-timestamp-guide',
    title: 'Unix Timestamp Guide',
    blurb: 'Convert seconds/milliseconds reliably and avoid timezone confusion in incident response.',
  },
]
</script>

<style scoped>
.page-content {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 15px 40px;
  line-height: 1.7;
  text-align: left;
}
.page-content h1 {
  font-size: 1.85rem;
  margin-bottom: 0.7rem;
}
.intro {
  color: #5d6d7e;
  margin-bottom: 1.4rem;
}
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.guide-card {
  display: block;
  border: 1px solid #dfe6e9;
  border-radius: 10px;
  padding: 14px;
  text-decoration: none;
  color: inherit;
  background: #f8fafc;
}
.guide-card:hover {
  border-color: #3498db;
}
.guide-card h2 {
  font-size: 1rem;
  margin-bottom: 0.45rem;
  color: #2563eb;
}
.guide-card p {
  font-size: 0.9rem;
  color: #334155;
}
:global(.app.dark) .intro {
  color: #bdc3c7;
}
:global(.app.dark) .guide-card {
  border-color: #374151;
  background: #111827;
}
:global(.app.dark) .guide-card p {
  color: #cbd5e1;
}
</style>
