<template>
  <div class="page-content">
    <h1>Contact</h1>
    <p class="intro">
      We welcome questions about Fast Toolkit, bug reports, and suggestions for new or improved tools.
    </p>

    <section>
      <h2>Email</h2>
      <p>
        <strong>General &amp; feedback:</strong>
        <a href="mailto:hello@fasttoolkit.dev">hello@fasttoolkit.dev</a>
      </p>
      <p>
        <strong>Privacy-related:</strong>
        <a href="mailto:privacy@fasttoolkit.dev">privacy@fasttoolkit.dev</a>
      </p>
    </section>

    <section>
      <h2>What to include</h2>
      <ul>
        <li>A short subject line (e.g. “Bug: JSON formatter on Safari”)</li>
        <li>Your browser and device (e.g. Chrome 120, iPhone)</li>
        <li>Steps to reproduce, or a minimal example (no secrets or passwords)</li>
      </ul>
    </section>

    <section>
      <h2>Response time</h2>
      <p>
        We read all messages; replies may take several business days depending on volume. We cannot provide individual support guarantees for a free service.
      </p>
    </section>

    <section>
      <h2>Related pages</h2>
      <ul>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/privacy">Privacy Policy</router-link></li>
        <li><router-link to="/faq">FAQ</router-link></li>
      </ul>
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
  margin-bottom: 0.75rem;
  color: #2c3e50;
}
.intro {
  margin-bottom: 1.5rem;
  color: #5d6d7e;
}
.page-content section {
  margin-bottom: 1.8rem;
}
.page-content h2 {
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
  color: #2c3e50;
}
.page-content p,
.page-content li {
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
:global(.app.dark) .intro {
  color: #bdc3c7;
}
:global(.app.dark) .page-content a {
  color: #5dade2;
}
</style>
