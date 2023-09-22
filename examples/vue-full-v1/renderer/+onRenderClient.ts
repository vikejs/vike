// https://vike.dev/onRenderClient
export default onRenderClient

import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContextClient } from 'vite-plugin-ssr/types'

let app: ReturnType<typeof createApp>
async function onRenderClient(pageContext: PageContextClient) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}
