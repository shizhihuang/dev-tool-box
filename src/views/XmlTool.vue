<template>
  <div class="tool-page">
    <p class="back-link"><router-link to="/">← All tools</router-link></p>
    <h1>XML Tools</h1>
    <div class="tool-layout">
      <div class="input-wrap">
        <textarea v-model="inputText" placeholder="Paste XML here..."></textarea>
        <button type="button" class="clear-btn" @click="inputText = ''; outputText = ''; status = 'Ready'">Clear</button>
      </div>
      <div class="output-wrap">
        <div class="action-bar">
          <button type="button" class="action-btn" @click="doFormat">Format</button>
          <button type="button" class="action-btn" @click="doMinify">Minify</button>
          <button type="button" class="action-btn" @click="doToJson">XML → JSON</button>
          <button type="button" class="action-btn copy-btn" @click="copy(outputText)">Copy Result</button>
        </div>
        <div class="meta-bar">
          <span>{{ status }}</span>
        </div>
        <pre class="result-content">{{ outputText }}</pre>
      </div>
    </div>
    <article class="tool-help tool-help--rich" lang="en">
      <h2>About these XML utilities</h2>
      <p>
        XML still powers SOAP integrations, RSS feeds, Android resources, and plenty of enterprise configuration pipelines.
        This page helps you beautify opaque blobs for code review, shrink them for transport, and explore a JSON projection when
        you need to reason about the same data in JavaScript tooling.
      </p>
      <p>
        Formatting relies on the browser’s <code>DOMParser</code> implementation, so you get the same structural validation Chrome or Firefox would apply.
        JSON conversion uses an explicit convention: attributes are prefixed with <code>@</code>, repeated sibling tags collapse into arrays,
        and mixed-content edge cases may introduce <code>#text</code> nodes—verify output before feeding it into strict schemas.
      </p>

      <h2>Good fits</h2>
      <ul>
        <li>Prettifying SOAP responses saved from proxy logs.</li>
        <li>Minifying Android XML resources before diffing.</li>
        <li>Exploring legacy config files prior to migrating them to JSON or YAML.</li>
      </ul>

      <h2>How to use this page</h2>
      <ol class="steps">
        <li>Paste well-formed XML into the editor.</li>
        <li>Use <strong>Format</strong> for indented output, or <strong>Minify</strong> to remove whitespace between tags.</li>
        <li>Use <strong>XML → JSON</strong> when you need a quick structural view inside JSON-aware tools.</li>
        <li>Copy the result after validating downstream expectations.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        Parsing and serialization happen entirely in your tab. Large documents may stress memory but never leave the device because of this tool.
      </p>

      <h2>Frequently asked questions</h2>
      <dl class="faq">
        <dt>Why does the parser reject my file?</dt>
        <dd>XML must be well-formed (matching tags, legal entities). Fix parsererror details shown in the output pane.</dd>
        <dt>Does JSON → XML exist here?</dt>
        <dd>Not in this version—export JSON elsewhere if you need the inverse transformation.</dd>
        <dt>Are namespaces preserved?</dt>
        <dd>Prefixes and xmlns declarations appear in attribute keys, but you should still validate with your target stack.</dd>
        <dt>Is mixed content handled perfectly?</dt>
        <dd>Complex mixtures of text and elements may require manual cleanup after conversion.</dd>
      </dl>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatXmlString, minifyXmlString, xmlToJson } from '../utils/xml.js'
import { trackToolUse, trackEvent } from '../utils/analytics.js'

const inputText = ref('')
const outputText = ref('')
const status = ref('Ready')

const doFormat = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    outputText.value = formatXmlString(inputText.value)
    status.value = 'Formatted'
    trackToolUse('xml', 'format')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const doMinify = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    outputText.value = minifyXmlString(inputText.value)
    status.value = 'Minified'
    trackToolUse('xml', 'minify')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const doToJson = () => {
  try {
    if (!inputText.value.trim()) {
      outputText.value = ''
      status.value = 'Ready'
      return
    }
    const obj = xmlToJson(inputText.value)
    outputText.value = JSON.stringify(obj, null, 2)
    status.value = 'XML → JSON'
    trackToolUse('xml', 'to_json')
  } catch (e) {
    outputText.value = String(e.message || e)
    status.value = 'Error'
  }
}

const copy = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    trackEvent('copy', { tool: 'xml' })
    alert('Copied to clipboard!')
  }).catch(() => {
    alert('Copy failed')
  })
}
</script>
