import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const app = createApp(pageContext)
  app.mount('#app')
}
