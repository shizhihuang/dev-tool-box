<template>
  <article class="guide-page">
    <h1>CSV and JSON Conversion Without Data Loss</h1>
    <p class="intro">
      Teams often move between spreadsheet workflows and API payloads. This guide shows how to convert CSV and JSON
      while keeping headers, escaping, and value types understandable.
    </p>

    <section>
      <h2>CSV is row-based, JSON is structure-based</h2>
      <p>
        CSV works best for flat tables. JSON supports nested objects and arrays. If your data is nested, choose an
        explicit flattening strategy before converting.
      </p>
    </section>

    <section>
      <h2>Escape rules matter</h2>
      <p>
        Commas, quotes, and line breaks inside values require CSV escaping. Use
        <router-link to="/csv-tools">CSV Tools</router-link> or <router-link to="/json-formatter">JSON Formatter</router-link>
        to inspect output instead of relying on spreadsheet auto-detection.
      </p>
    </section>

    <section>
      <h2>Type expectations</h2>
      <ul>
        <li>CSV values are text by default.</li>
        <li>JSON preserves booleans, numbers, null, and nested structures.</li>
        <li>Document which columns are expected as numeric or date values downstream.</li>
      </ul>
    </section>

    <section>
      <h2>Recommended workflow</h2>
      <ul>
        <li>Validate and clean source JSON first.</li>
        <li>Convert to CSV for business review.</li>
        <li>Convert approved edits back to JSON and run schema checks.</li>
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
