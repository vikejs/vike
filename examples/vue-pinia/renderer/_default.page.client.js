import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { createApp } from './app'

let app
useClientRouter({
  render(pageContext) {
    if (!app) {
      const instance = createApp(pageContext)
      app = instance.app
      instance.store.state.value = pageContext.INITIAL_STATE
      app.mount('#app')
    } else {
      app.changePage(pageContext)
    }
  },
  // Vue needs the first render to be a hydration
  ensureHydration: true
})
