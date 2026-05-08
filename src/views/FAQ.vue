<template>
  <div class="page-content">
    <h1>Frequently Asked Questions</h1>
    <p class="intro">
      Answers about Fast Toolkit (fasttoolkit.dev): what we offer, how your data is handled, and how to get help.
    </p>

    <section v-for="item in faqs" :key="item.q" class="faq-item">
      <h2>{{ item.q }}</h2>
      <p>{{ item.a }}</p>
    </section>

    <section>
      <h2>Still have questions?</h2>
      <p>
        See our <router-link to="/contact">Contact</router-link> page or email
        <a href="mailto:hello@fasttoolkit.dev">hello@fasttoolkit.dev</a>.
      </p>
    </section>
  </div>
</template>

<script setup>
const faqs = [
  {
    q: 'What is Fast Toolkit?',
    a: 'Fast Toolkit is a free set of online developer utilities: JSON formatting, Base64 and URL encoding, URL parsing, CSV conversion from JSON, regex testing, and more. Everything runs in your browser.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You can use all tools without signing up.',
  },
  {
    q: 'Is my data sent to your servers?',
    a: 'The tools process your input locally in the browser. We do not collect or store the text you paste into the tool areas. See our Privacy Policy for details on analytics and hosting.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'Modern browsers such as Chrome, Firefox, Safari, and Edge work best. Some features rely on standard JavaScript APIs available in current versions.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The layout is responsive so you can use the tools on phones and tablets.',
  },
  {
    q: 'Why does JSON formatting fail?',
    a: 'The input must be valid JSON. Common issues include trailing commas, single quotes instead of double quotes, or unescaped characters. Fix the syntax and try again.',
  },
  {
    q: 'What does “JSON to CSV” expect?',
    a: 'It expects a JSON object or an array of objects. Each object’s keys become column headers; nested objects are not flattened.',
  },
  {
    q: 'How does URL parsing work?',
    a: 'Paste a full URL (including https://). The tool splits protocol, host, path, query parameters, and hash using the browser’s URL API.',
  },
  {
    q: 'How do I use the Regex Tester?',
    a: 'Enter your text, a JavaScript-style pattern, and optional flags (e.g. g, i, m). Match lists all occurrences; Replace shows a preview with matches replaced by a placeholder.',
  },
  {
    q: 'Do you use cookies or analytics?',
    a: 'We may use Google Analytics to understand traffic. Third-party services used on the site are described in our Privacy Policy.',
  },
  {
    q: 'Can I use these tools for commercial work?',
    a: 'Yes. The tools are provided as-is for your convenience. You are responsible for compliance with any laws or policies that apply to your data.',
  },
  {
    q: 'How do I report a bug or suggest a feature?',
    a: 'Use the Contact page or email hello@fasttoolkit.dev with a short description, your browser, and steps to reproduce if applicable.',
  },
  {
    q: 'Will you add more tools?',
    a: 'We improve the site over time. Suggestions are welcome via email.',
  },
  {
    q: 'Who operates this site?',
    a: 'Fast Toolkit is operated as an independent developer utility site. Legal and privacy details are on the About and Privacy pages.',
  },
]
</script>

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
.faq-item {
  margin-bottom: 1.5rem;
}
.page-content h2 {
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
  color: #2c3e50;
}
.page-content p {
  margin-bottom: 0.5rem;
  color: #2c3e50;
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
:global(.app.dark) .page-content p {
  color: #f8f8f8;
}
:global(.app.dark) .intro {
  color: #bdc3c7;
}
:global(.app.dark) .page-content a {
  color: #5dade2;
}
</style>
