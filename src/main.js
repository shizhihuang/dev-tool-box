import { ViteSSG } from 'vite-ssg'
import './style.css'
import './assets/tool-shared.css'
import App from './App.vue'
import { routes } from './router/routes.js'
import { trackPageView } from './utils/analytics.js'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  },
  ({ router, isClient }) => {
    router.afterEach((to) => {
      if (isClient) {
        trackPageView(to.fullPath)
      }
    })
  },
)
