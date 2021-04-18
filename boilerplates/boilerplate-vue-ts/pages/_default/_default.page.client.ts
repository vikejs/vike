import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const { Page, contextProps } = await getPage()
  const app = createApp(Page, contextProps.pageProps)
  app.mount('#app')
}
