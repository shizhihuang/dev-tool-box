<template>
  <article class="guide-page">
    <h1>URL Encoding Explained for Backend and Frontend Debugging</h1>
    <p class="intro">
      URL encoding prevents reserved characters from breaking query strings and routes. This guide explains where
      encoding is required and how to verify output safely.
    </p>

    <section>
      <h2>Key rule: encode components, not entire URLs blindly</h2>
      <p>
        Encode query parameter values or path segments, then assemble the final URL. Double-encoding often produces
        bugs like `%2520` when you expected `%20`.
      </p>
    </section>

    <section>
      <h2>Typical failure modes</h2>
      <ul>
        <li>Spaces in query strings not encoded consistently.</li>
        <li>Reserved symbols like <code>&amp;</code> and <code>?</code> leaking from user input.</li>
        <li>Repeated encoding during redirects or middleware rewrites.</li>
      </ul>
    </section>

    <section>
      <h2>Fast Toolkit workflow</h2>
      <p>
        Use <router-link to="/url-encode-decode">URL Encode/Decode &amp; Parse</router-link> to encode a value, decode
        a suspect string, then parse the full URL and inspect query parameters as structured output.
      </p>
    </section>

    <section>
      <h2>Production checklist</h2>
      <ul>
        <li>Normalize encoding at your API boundary.</li>
        <li>Log decoded values safely (never include secrets).</li>
        <li>Add automated tests for redirect and callback URL handling.</li>
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
