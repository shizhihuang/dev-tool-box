const SITE_ORIGIN = 'https://fasttoolkit.dev'
const DEFAULT_TITLE = 'Fast Toolkit - Free Online Dev Tools'

/**
 * Head payload for @unhead/vue — works in SSR (vite-ssg) and client.
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 */
export function buildHeadFromRoute(route) {
  const seo = route.meta?.seo
  const path = route.path || '/'
  const canonicalDefault = `${SITE_ORIGIN}${path === '/' ? '/' : path}`

  if (!seo) {
    return {
      title: DEFAULT_TITLE,
      link: [{ rel: 'canonical', href: canonicalDefault }],
    }
  }

  const canonical = seo.canonical || canonicalDefault
  const title = seo.title || DEFAULT_TITLE

  return {
    title,
    meta: [
      seo.description ? { name: 'description', content: seo.description } : null,
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:site_name', content: 'Fast Toolkit' },
      { property: 'og:title', content: seo.ogTitle || title },
      { property: 'og:description', content: seo.ogDescription || seo.description || '' },
      { property: 'og:url', content: canonical },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.twitterTitle || title },
      { name: 'twitter:description', content: seo.twitterDescription || seo.description || '' },
    ].filter(Boolean),
    link: [{ rel: 'canonical', href: canonical }],
  }
}

export { SITE_ORIGIN, DEFAULT_TITLE }
