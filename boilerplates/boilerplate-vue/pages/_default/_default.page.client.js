import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const { Page, pageContext } = await getPage()
  const app = createApp(Page, pageContext)
  app.mount('#app')
}
