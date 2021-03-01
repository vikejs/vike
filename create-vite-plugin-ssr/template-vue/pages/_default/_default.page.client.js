import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  const app = createApp({ Page, pageProps })
  app.mount('#app')
}
