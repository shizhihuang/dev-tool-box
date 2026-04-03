import { createRouter, createWebHistory } from 'vue-router'
import { applyRouteSeo } from '../utils/seo.js'
import { trackPageView } from '../utils/analytics.js'
import ToolIndex from '../views/ToolIndex.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import About from '../views/About.vue'

const seo = (title, description, overrides = {}) => ({
  title,
  description,
  ogTitle: overrides.ogTitle ?? title,
  ogDescription: overrides.ogDescription ?? description,
  twitterTitle: overrides.twitterTitle ?? title,
  twitterDescription: overrides.twitterDescription ?? description,
  canonical: overrides.canonical,
})

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ToolIndex,
    meta: {
      seo: seo(
        'Fast Toolkit — Privacy-First Dev Utilities | JSON, YAML, CSV & More',
        'Built for developers worldwide: JSON, XML, YAML, CSV, Markdown, QR codes, timestamps, Base64, URL, regex, HTML entities, UUID, number bases & color tools — all in your browser. No sign-up, no uploads; your input never hits our servers.',
      ),
    },
  },
  {
    path: '/json-formatter',
    name: 'JsonFormatter',
    component: () => import('../views/JsonFormatter.vue'),
    meta: {
      seo: seo(
        'JSON Formatter & Validator | Fast Toolkit',
        'Format, minify, validate, and sort JSON online. Convert JSON to CSV. Runs locally in your browser.',
      ),
    },
  },
  {
    path: '/yaml-json',
    name: 'YamlJson',
    component: () => import('../views/YamlJsonTool.vue'),
    meta: {
      seo: seo(
        'YAML to JSON & JSON to YAML Converter | Fast Toolkit',
        'Convert YAML to JSON and JSON to YAML in the browser. Ideal for configs, K8s, and CI files.',
      ),
    },
  },
  {
    path: '/csv-tools',
    name: 'CsvTools',
    component: () => import('../views/CsvTool.vue'),
    meta: {
      seo: seo(
        'CSV Formatter & CSV ↔ JSON | Fast Toolkit',
        'Format CSV columns, minify, convert CSV to JSON, and JSON array to CSV. Custom delimiter support.',
      ),
    },
  },
  {
    path: '/markdown-preview',
    name: 'MarkdownPreview',
    component: () => import('../views/MarkdownPreview.vue'),
    meta: {
      seo: seo(
        'Markdown Preview Online | Fast Toolkit',
        'Live Markdown preview in your browser with safe rendering (HTML disabled). Copy generated HTML.',
      ),
    },
  },
  {
    path: '/qr-code-generator',
    name: 'QrGenerator',
    component: () => import('../views/QrGenerator.vue'),
    meta: {
      seo: seo(
        'QR Code Generator | Fast Toolkit',
        'Create QR codes from text or URLs. Download PNG. All processing happens locally.',
      ),
    },
  },
  {
    path: '/timestamp-converter',
    name: 'TimestampConverter',
    component: () => import('../views/TimestampConverter.vue'),
    meta: {
      seo: seo(
        'Unix Timestamp Converter | Fast Toolkit',
        'Convert Unix time (seconds or milliseconds) to ISO 8601 and local time. Parse date strings instantly.',
      ),
    },
  },
  {
    path: '/image-base64',
    name: 'ImageBase64',
    component: () => import('../views/ImageBase64.vue'),
    meta: {
      seo: seo(
        'Image to Base64 & Data URL | Fast Toolkit',
        'Turn images into Data URLs or raw Base64 without uploading files. Preview in the browser.',
      ),
    },
  },
  {
    path: '/base64',
    name: 'Base64',
    component: () => import('../views/Base64Tool.vue'),
    meta: {
      seo: seo(
        'Base64 Encode & Decode (Text) | Fast Toolkit',
        'Encode text to Base64 or decode Base64 to UTF-8 text online. Private and fast.',
      ),
    },
  },
  {
    path: '/url-encode-decode',
    name: 'UrlTool',
    component: () => import('../views/UrlTool.vue'),
    meta: {
      seo: seo(
        'URL Encode, Decode & Parse | Fast Toolkit',
        'Encode or decode URL components and parse full URLs into parts. For debugging APIs and redirects.',
      ),
    },
  },
  {
    path: '/regex-tester',
    name: 'RegexTester',
    component: () => import('../views/RegexTool.vue'),
    meta: {
      seo: seo(
        'Regex Tester Online | Fast Toolkit',
        'Test JavaScript regular expressions: view matches and replace previews with custom flags.',
      ),
    },
  },
  {
    path: '/xml-tools',
    name: 'XmlTools',
    component: () => import('../views/XmlTool.vue'),
    meta: {
      seo: seo(
        'XML Formatter & XML to JSON | Fast Toolkit',
        'Pretty-print or minify XML and convert XML documents to JSON in your browser. Private, no upload.',
      ),
    },
  },
  {
    path: '/html-entities',
    name: 'HtmlEntities',
    component: () => import('../views/HtmlEntitiesTool.vue'),
    meta: {
      seo: seo(
        'HTML Entity Escape & Unescape | Fast Toolkit',
        'Escape special HTML characters or decode named and numeric entities. Runs locally in the browser.',
      ),
    },
  },
  {
    path: '/uuid-generator',
    name: 'UuidGenerator',
    component: () => import('../views/UuidTool.vue'),
    meta: {
      seo: seo(
        'UUID v4 Generator | Fast Toolkit',
        'Generate RFC 4122 version 4 UUIDs in bulk. Uses Web Crypto when available. No server round-trip.',
      ),
    },
  },
  {
    path: '/number-base-converter',
    name: 'NumberBaseConverter',
    component: () => import('../views/NumberBaseTool.vue'),
    meta: {
      seo: seo(
        'Number Base Converter (2–36) | Fast Toolkit',
        'Convert integers between binary, decimal, hex, and any base 2–36 with BigInt precision. Client-side only.',
      ),
    },
  },
  {
    path: '/color-picker',
    name: 'ColorPicker',
    component: () => import('../views/ColorPickerTool.vue'),
    meta: {
      seo: seo(
        'Color Picker — HEX, RGB & HSL | Fast Toolkit',
        'Pick colors and copy HEX, rgb(), and hsl() values for CSS. All processing happens in your browser.',
      ),
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      seo: seo(
        'About Fast Toolkit',
        'Fast Toolkit is a free collection of browser-based developer tools. Privacy-first, no install.',
      ),
    },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPolicy,
    meta: {
      seo: seo(
        'Privacy Policy | Fast Toolkit',
        'How Fast Toolkit handles analytics, ads, and your data. Tools run locally in your browser.',
      ),
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  applyRouteSeo(to)
  trackPageView(to.fullPath)
})

export default router
