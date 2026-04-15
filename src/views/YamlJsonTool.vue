<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>YAML ↔ JSON Converter</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="inputText" placeholder="Paste YAML or JSON here..."></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="yamlToJson">YAML → JSON</button>
          <button type="button" class="action-btn" @click="jsonToYaml">JSON → YAML</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>Why convert YAML and JSON?</h2>
      <p>
        YAML remains the default for many operations teams—Kubernetes manifests, GitHub Actions, Ansible inventories—while JSON
        dominates browser APIs and NoSQL document stores. Moving between the two formats is a daily task when you validate a
        cluster export in jq, diff configs, or embed the same structure inside a JSON-only pipeline.
      </p>
      <p>
        This converter uses a mature YAML parser bundled with the page. Round-trips are intentionally conservative: advanced YAML
        features such as anchors, aliases, and custom tags may flatten when you serialize back out, so treat output as a structural
        representation rather than a byte-for-byte preservation of exotic YAML.
      </p>

      <h2>Ideal workflows</h2>
      <ul>
        <li>Paste a service manifest, convert to JSON, and pipe through your organization’s JSON schema validator.</li>
        <li>Convert API examples from OpenAPI JSON snippets into readable YAML for documentation.</li>
        <li>Prototype config changes in YAML, then export JSON for tools that only accept JSON.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste YAML or JSON into the editor depending on your starting format.</li>
        <li>Click <strong>YAML → JSON</strong> when the left editor contains YAML. Errors display parser hints inline.</li>
        <li>Click <strong>JSON → YAML</strong> when the editor contains valid JSON (objects, arrays, primitives).</li>
        <li>Copy the output once you confirm indentation and quoting meet downstream expectations.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        Parsing happens entirely in-browser. Clear the textarea after handling secrets such as sealed secrets or tokens—even though nothing is uploaded, shoulder surfing still matters.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Are YAML anchors preserved?</dt>
        <dd>Not reliably. The JSON intermediate representation expands anchors, and dumping back to YAML may inline values.</dd>
        <dt>Why does JSON → YAML wrap strings in quotes?</dt>
        <dd>The serializer chooses quoting when values look ambiguous to YAML (for example booleans or numbers).</dd>
        <dt>Can I convert multi-document YAML?</dt>
        <dd>Only the first document is supported in this UI. Split files manually for predictable results.</dd>
        <dt>Does this hit an API?</dt>
        <dd>No. Both directions run locally with bundled JavaScript.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import yaml from 'js-yaml'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')

const yamlToJson = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    const data = yaml.load(inputText.value)
    outputText.value = JSON.stringify(data, null, 2)
    status.value = 'Converted YAML → JSON'
    trackToolUse('yaml_json', 'yaml_to_json')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'YAML parse error'
  }
}

const jsonToYaml = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    const data = JSON.parse(inputText.value)
    outputText.value = yaml.dump(data, { lineWidth: 120, noRefs: true })
    status.value = 'Converted JSON → YAML'
    trackToolUse('yaml_json', 'json_to_yaml')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'JSON parse error'
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'yaml_json' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed, please copy manually')
  })
}
</script>
