import { createApp } from './app'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

export { render }

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const app = createApp(pageContext)
  app.mount('#app')
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
