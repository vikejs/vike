import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page } = pageContext
  const { app, store } = createApp({ Page })
  store.replaceState(pageContext.INITIAL_STATE)
  app.mount('#app')
}
