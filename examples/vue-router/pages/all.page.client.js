import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page } = pageContext
  const { app, router } = createApp({ Page })
  await router.isReady()
  app.mount('#app')
}
