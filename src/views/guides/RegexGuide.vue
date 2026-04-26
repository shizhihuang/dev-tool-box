<template>
  <article class="guide-page">
    <h1>Regex for Developers: Safer Patterns and Faster Debugging</h1>
    <p class="intro">
      Regular expressions are powerful and easy to misuse. This guide focuses on practical patterns, safe defaults,
      and how to test incrementally.
    </p>

    <section>
      <h2>Start with explicit scope</h2>
      <p>
        Define exactly what input shape you expect. Avoid giant one-line patterns copied from the internet without
        context. In many cases, a few simpler checks are safer than one complex expression.
      </p>
    </section>

    <section>
      <h2>Use flags intentionally</h2>
      <ul>
        <li><code>g</code>: global search.</li>
        <li><code>i</code>: case-insensitive matching.</li>
        <li><code>m</code>: multi-line mode for line anchors.</li>
      </ul>
      <p>
        Test each flag separately in <router-link to="/regex-tester">Regex Tester</router-link> before combining.
      </p>
    </section>

    <section>
      <h2>Avoid catastrophic backtracking</h2>
      <p>
        Nested quantifiers like <code>(a+)+</code> can explode runtime on crafted input. Prefer bounded patterns and
        anchors where possible when handling untrusted text.
      </p>
    </section>

    <section>
      <h2>Debugging routine</h2>
      <ul>
        <li>Test against short known-good strings first.</li>
        <li>Add one token at a time and re-run matches.</li>
        <li>Keep examples for both expected matches and expected non-matches.</li>
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
