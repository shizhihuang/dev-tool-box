<template>
  <article class="guide-page">
    <h1>Base64 Encoding Guide: What It Is and What It Is Not</h1>
    <p class="intro">
      Base64 is an encoding format, not encryption. Use this page to avoid common security and data-transfer mistakes
      when handling tokens, binary payloads, and transport constraints.
    </p>

    <section>
      <h2>When Base64 is useful</h2>
      <ul>
        <li>Embedding binary data in text channels (JSON, XML, email bodies).</li>
        <li>Creating Data URLs for quick previews.</li>
        <li>Moving opaque blobs across systems that expect plain text.</li>
      </ul>
    </section>

    <section>
      <h2>When Base64 is not enough</h2>
      <p>
        Base64 does not protect secrets. Anyone can decode it instantly. If you need confidentiality or integrity, use
        proper encryption and signing mechanisms, not simple encoding.
      </p>
    </section>

    <section>
      <h2>Debugging workflow</h2>
      <p>
        Use <router-link to="/base64">Base64 Encode &amp; Decode</router-link> for text payloads and
        <router-link to="/image-base64">Image to Base64</router-link> for local image conversion. Keep line endings and
        UTF-8 handling consistent when comparing decoded output.
      </p>
    </section>

    <section>
      <h2>Practical checks</h2>
      <ul>
        <li>Document whether a field expects raw text, Base64 text, or a Data URL prefix.</li>
        <li>Reject malformed input early and log decode errors clearly.</li>
        <li>Strip test payloads from logs before sharing incident reports.</li>
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
