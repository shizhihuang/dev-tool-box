export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/** SPA navigation: call after updating document.title */
export function trackPageView(path) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  })
}

export function trackToolUse(tool, action) {
  trackEvent('tool_use', {
    tool,
    action,
    tool_action: `${tool}_${action}`,
  })
}

export function trackTabSelect(tab) {
  trackEvent('select_content', {
    content_type: 'tool_tab',
    item_id: tab,
  })
}
