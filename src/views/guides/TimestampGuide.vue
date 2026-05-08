<template>
  <article class="guide-page">
    <h1>Unix Timestamp Guide for Reliable Incident Timelines</h1>
    <p class="intro">
      Timestamp confusion causes real outages. This guide helps you distinguish seconds vs milliseconds, UTC vs local
      display, and safe conversion patterns.
    </p>

    <section>
      <h2>Seconds vs milliseconds</h2>
      <p>
        A 10-digit Unix value is usually seconds. A 13-digit value is usually milliseconds. Treating one as the other
        shifts dates by decades and breaks event correlation.
      </p>
    </section>

    <section>
      <h2>Store UTC, display local</h2>
      <p>
        Persist timestamps in UTC for consistency, then convert to local time only for UI display.
        <router-link to="/timestamp-converter">Timestamp Converter</router-link> helps compare both representations.
      </p>
    </section>

    <section>
      <h2>Parsing date strings safely</h2>
      <ul>
        <li>Prefer ISO 8601 with timezone offsets.</li>
        <li>Avoid locale-dependent date formats in APIs.</li>
        <li>Keep logs explicit about timezone context.</li>
      </ul>
    </section>

    <section>
      <h2>Operations checklist</h2>
      <ul>
        <li>Normalize event timestamps before sorting.</li>
        <li>Annotate dashboards with timezone assumptions.</li>
        <li>Use one conversion source of truth in postmortems.</li>
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
