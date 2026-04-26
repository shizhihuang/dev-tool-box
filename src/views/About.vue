<template>
  <div class="page-content">
    <h1>About Fast Toolkit</h1>

    <section>
      <h2>What is Fast Toolkit?</h2>
      <p>
        Fast Toolkit is a free, browser-based collection of developer tools. No installation required—just open the site and start using the tools.
        All processing happens locally in your browser, so your data stays private.
      </p>
    </section>

    <section>
      <h2>Available Tools</h2>
      <ul>
        <li><strong>JSON</strong> – Format, minify, sort keys, validate, and convert JSON objects to CSV.</li>
        <li><strong>Base64 Encode/Decode</strong> – Encode text to Base64 or decode Base64 back to plain text.</li>
        <li><strong>URL</strong> – Encode, decode, and parse full URLs into components and query parameters.</li>
        <li><strong>Regex Tester</strong> – Test patterns with flags and preview matches or replacements.</li>
      </ul>
    </section>

    <section>
      <h2>Why Use Fast Toolkit?</h2>
      <ul>
        <li><strong>Free &amp; Simple</strong> – No sign-up, no limits, no paywall.</li>
        <li><strong>Privacy-First</strong> – Your input never leaves your device. We don't store or transmit your data.</li>
        <li><strong>Light &amp; Dark Mode</strong> – Use the theme that works best for you.</li>
      </ul>
    </section>

    <section>
      <h2>Contact &amp; help</h2>
      <p>
        Visit our <router-link to="/contact">Contact</router-link> page or read the
        <router-link to="/faq">FAQ</router-link>. You can also email
        <a href="mailto:hello@fasttoolkit.dev">hello@fasttoolkit.dev</a>.
      </p>
    </section>
  </div>
</template>

<style scoped>
.page-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 15px 40px;
  line-height: 1.7;
  color: #2c3e50;
  text-align: left;
}
.page-content h1 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}
.page-content section {
  margin-bottom: 1.8rem;
}
.page-content h2 {
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
  color: #2c3e50;
}
.page-content p, .page-content li {
  margin-bottom: 0.6rem;
  color: #2c3e50;
}
.page-content ul {
  margin: 0.5rem 0 0 1.2rem;
}
.page-content a {
  color: #3498db;
  text-decoration: none;
}
.page-content a:hover {
  text-decoration: underline;
}
:global(.app.dark) .page-content,
:global(.app.dark) .page-content h1,
:global(.app.dark) .page-content h2,
:global(.app.dark) .page-content p,
:global(.app.dark) .page-content li {
  color: #f8f8f8;
}
:global(.app.dark) .page-content a {
  color: #5dade2;
}
</style>
