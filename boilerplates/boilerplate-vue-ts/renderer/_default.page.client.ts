import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'

hydrate()

async function hydrate() {
  // For Client-side Routing we should use `useClientRouter()` instead of `getPage()`.
  // See https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>()
  const app = createApp(pageContext)
  app.mount('#app')
}
