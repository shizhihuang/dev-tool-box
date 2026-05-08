<template>
  <article class="guide-page">
    <h1>JSON Formatting Best Practices for API Work</h1>
    <p class="intro">
      JSON looks simple until a production payload fails to parse. This guide covers a safe workflow for validating,
      formatting, and comparing JSON when debugging APIs and logs.
    </p>

    <section>
      <h2>1) Validate before you format</h2>
      <p>
        Start with syntax validation. Common failures include trailing commas, single quotes, and comments copied from
        docs. In Fast Toolkit, open <router-link to="/json-formatter">JSON Formatter</router-link> and click
        <strong>Validate</strong> first.
      </p>
    </section>

    <section>
      <h2>2) Use pretty format for review, minify for transport</h2>
      <p>
        Pretty JSON is best for humans and code review. Minified JSON is best for reduced payload size when sending
        over the network. Keep both forms available and never review large minified blobs in pull requests.
      </p>
    </section>

    <section>
      <h2>3) Sort keys for stable diffs</h2>
      <p>
        If object key order changes between runs, your diffs get noisy. Sorting keys makes snapshots deterministic and
        helps spot real data changes faster.
      </p>
    </section>

    <section>
      <h2>4) Convert to CSV only for flat tables</h2>
      <p>
        JSON-to-CSV is excellent for quick spreadsheet checks, but nested objects should be flattened explicitly first.
        Otherwise, output can be ambiguous for non-technical stakeholders.
      </p>
    </section>

    <section>
      <h2>Checklist before shipping</h2>
      <ul>
        <li>Validate syntax with a parser, not by eye.</li>
        <li>Keep secrets out of screenshots and bug tickets.</li>
        <li>Use sorted keys when comparing payload versions.</li>
        <li>Store contract examples in version control.</li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.guide-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 15px 40px;
  line-height: 1.7;
  text-align: left;
}
.guide-page h1 {
  font-size: 1.85rem;
  margin-bottom: 0.75rem;
}
.intro {
  color: #5d6d7e;
  margin-bottom: 1.4rem;
}
.guide-page section {
  margin-bottom: 1.4rem;
}
.guide-page h2 {
  font-size: 1.15rem;
  margin-bottom: 0.45rem;
}
.guide-page ul {
  margin-left: 1.1rem;
}
:global(.app.dark) .intro {
  color: #bdc3c7;
}
</style>
