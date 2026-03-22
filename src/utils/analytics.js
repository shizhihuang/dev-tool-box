export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
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
