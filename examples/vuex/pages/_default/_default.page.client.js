import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const { Page, contextProps } = await getPage()
  const { app, store } = createApp({ Page })
  store.replaceState(contextProps.INITIAL_STATE)
  app.mount('#app')
}
