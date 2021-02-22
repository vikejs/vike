import { getPage } from 'vite-plugin-ssr/client'
import { getApp } from './app'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  const app = getApp(Page, pageProps)
  app.mount('#app')
}
