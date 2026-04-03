const SITE_ORIGIN = 'https://fasttoolkit.dev'
const DEFAULT_TITLE = 'Fast Toolkit - Free Online Dev Tools'

function setMeta(attrName, key, value) {
  if (!value) return
  let el = document.querySelector(`meta[${attrName}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Apply document title and meta tags from route.meta.seo
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 */
export function applyRouteSeo(route) {
  const seo = route.meta?.seo
  if (!seo) return

  const path = route.path || '/'
  const canonical = seo.canonical || `${SITE_ORIGIN}${path === '/' ? '/' : path}`

  document.title = seo.title || DEFAULT_TITLE

  if (seo.description) {
    setMeta('name', 'description', seo.description)
  }

  setMeta('property', 'og:title', seo.ogTitle || seo.title || DEFAULT_TITLE)
  setMeta('property', 'og:description', seo.ogDescription || seo.description || '')
  setMeta('property', 'og:url', canonical)
  setMeta('name', 'twitter:title', seo.twitterTitle || seo.title || DEFAULT_TITLE)
  setMeta('name', 'twitter:description', seo.twitterDescription || seo.description || '')

  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', canonical)
}

export { SITE_ORIGIN, DEFAULT_TITLE }
