// https://vite-plugin-ssr.com/onRenderClient
export default onRenderClient

import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type {
  //*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from 'vite-plugin-ssr/types'

let app: ReturnType<typeof createApp>
async function onRenderClient(pageContext: PageContextBuiltInClient & PageContext) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}
