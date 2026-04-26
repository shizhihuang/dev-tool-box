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
        <li><strong>JSON Formatter</strong> – Format, minify, validate, sort keys, and convert JSON to CSV.</li>
        <li><strong>XML Tools</strong> – Format, minify XML, and convert XML to JSON.</li>
        <li><strong>YAML ↔ JSON</strong> – Convert between YAML and JSON for configs and APIs.</li>
        <li><strong>CSV tools</strong> – Align columns, minify, and convert between CSV and JSON.</li>
        <li><strong>Markdown Preview</strong> – Live preview with safe rendering (raw HTML disabled).</li>
        <li><strong>QR Code Generator</strong> – Create QR codes from text or URLs; download PNG.</li>
        <li><strong>Timestamp Converter</strong> – Unix seconds/milliseconds, ISO, and local time.</li>
        <li><strong>Image → Base64</strong> – Data URLs and raw Base64 from images, locally in the browser.</li>
        <li><strong>Base64 (text)</strong> – Encode or decode UTF-8 text as Base64.</li>
        <li><strong>URL Encode/Decode</strong> – Encode, decode, and parse URLs.</li>
        <li><strong>Regex Tester</strong> – Match and replace previews with custom flags.</li>
        <li><strong>HTML Entities</strong> – Escape special characters or decode entities.</li>
        <li><strong>UUID Generator</strong> – Batch-generate version 4 UUIDs (Web Crypto when available).</li>
        <li><strong>Number Base Converter</strong> – Convert integers between bases 2–36 with BigInt.</li>
        <li><strong>Color Picker</strong> – Pick colors and copy HEX, rgb(), and hsl() for CSS.</li>
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
      <h2>Editorial approach</h2>
      <p>
        Each tool page includes original guidance: what the utility is for, how to operate it safely, and frequently asked questions.
        We avoid auto-generated filler; when a feature has sharp edges (for example YAML anchors or XML mixed content), we call that out explicitly
        so you can choose the right workflow before you invest time.
      </p>
      <p>
        Fast Toolkit is operated by an independent maintainer focused on international developers. Revenue from display advertising may fund hosting
        on Vercel, domain renewals, and incremental improvements. Advertising does not change the fact that tool execution stays inside your browser.
      </p>
    </section>

    <section>
      <h2>Relationship to Google services</h2>
      <p>
        We use Google Analytics to understand aggregate traffic and may use Google AdSense to show ads. Those services have their own privacy policies
        and cookies as described in our Privacy Policy. Opting out of personalized ads or analytics is handled through your Google account or browser
        settings where applicable.
      </p>
    </section>

    <section>
      <h2>Frequently asked questions</h2>
      <dl class="about-faq">
        <dt>Is Fast Toolkit open source?</dt>
        <dd>If a public repository is published for this project, the shipped LICENSE file controls reuse. Otherwise, treat the deployed site as a hosted service.</dd>
        <dt>Do you offer SLAs or enterprise support?</dt>
        <dd>Not today—email us for bespoke arrangements if you need a hardened internal deployment.</dd>
        <dt>Will you read my pasted API keys?</dt>
        <dd>We cannot read your clipboard. Follow your company policy for secrets regardless of which website you visit.</dd>
        <dt>How often is content updated?</dt>
        <dd>Tool descriptions evolve as users report edge cases. The “Last updated” note on legal pages tracks policy changes.</dd>
      </dl>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions or feedback? Reach out at
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

.about-faq dt {
  font-weight: 600;
  margin-top: 0.9rem;
}

.about-faq dt:first-child {
  margin-top: 0.25rem;
}

.about-faq dd {
  margin: 0.35rem 0 0 0;
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
