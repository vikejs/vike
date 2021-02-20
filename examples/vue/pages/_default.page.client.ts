import { getPage } from 'vite-plugin-ssr/client'
import { getApp } from './_app'

hydrate()

async function hydrate() {
  const { Page, initialProps } = await getPage()
  const app = getApp(Page, initialProps)
  app.mount('#app')
}
