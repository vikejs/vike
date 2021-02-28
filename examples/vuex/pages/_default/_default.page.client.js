import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  const { app, store } = createApp({ Page })
  store.replaceState(pageProps.INITIAL_STATE)
  app.mount('#app')
}
