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
    <div class="tool-help">
      <h2>YAML ↔ JSON</h2>
      <p>Convert between YAML and JSON in the browser. Handy for Kubernetes configs, CI files, and API debugging.</p>
      <ul>
        <li><strong>YAML → JSON:</strong> Parses YAML and prints formatted JSON.</li>
        <li><strong>JSON → YAML:</strong> Parses JSON and prints YAML (anchors are not preserved).</li>
      </ul>
    </div>
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
