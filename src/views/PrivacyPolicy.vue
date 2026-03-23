<template>
  <div class="page-content">
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: March 18, 2025</p>

    <section>
      <h2>1. Introduction</h2>
      <p>
        Welcome to Fast Toolkit ("we", "our", or "us"). We operate fasttoolkit.dev and are committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, and safeguard your information when you use our online developer tools.
      </p>
    </section>

    <section>
      <h2>2. Information We Do NOT Collect</h2>
      <p>
        Our tools (JSON Formatter, Base64 Encode/Decode, URL Encode/Decode) run entirely in your browser. We do <strong>not</strong> collect,
        store, or transmit any of the data you paste or input. Your content never leaves your device for our servers.
      </p>
    </section>

    <section>
      <h2>3. Information We Collect</h2>
      <p>We use the following third-party services that may collect certain information:</p>
      <ul>
        <li>
          <strong>Google Analytics</strong>: We use Google Analytics to understand how visitors use our site. This may include your IP address,
          browser type, device information, pages visited, and general usage patterns. Google's privacy policy:
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
        </li>
        <li>
          <strong>Google AdSense</strong> (if applicable): If we display advertisements, Google AdSense may use cookies and similar technologies
          to serve relevant ads. See Google's Advertising policy:
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
        </li>
        <li>
          <strong>Vercel</strong>: Our site is hosted on Vercel. Vercel may collect basic access logs (IP, timestamps) for operational purposes.
          See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a>.
        </li>
      </ul>
    </section>

    <section>
      <h2>4. Cookies</h2>
      <p>
        We do not set our own cookies. However, Google Analytics and other third-party services may use cookies to function.
        You can control cookies through your browser settings. Disabling cookies may affect the functionality of our site.
      </p>
    </section>

    <section>
      <h2>5. How We Use Your Information</h2>
      <p>Any information collected by third-party services is used to:</p>
      <ul>
        <li>Understand how visitors use our site and improve the user experience</li>
        <li>Display relevant advertisements (if AdSense is enabled)</li>
        <li>Comply with legal obligations</li>
      </ul>
    </section>

    <section>
      <h2>6. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your personal data. You can opt out of Google Analytics
        using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
      </p>
    </section>

    <section>
      <h2>7. Children's Privacy</h2>
      <p>
        Our site is not directed at children under 13. We do not knowingly collect personal information from children.
      </p>
    </section>

    <section>
      <h2>8. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date at the top will reflect the latest version.
      </p>
    </section>

    <section>
      <h2>9. Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at
        <a href="mailto:privacy@fasttoolkit.dev">privacy@fasttoolkit.dev</a>.
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
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
.updated {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 2rem;
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
:global(.app.dark) .page-content .updated {
  color: #bdc3c7;
}
:global(.app.dark) .page-content a {
  color: #5dade2;
}
</style>
