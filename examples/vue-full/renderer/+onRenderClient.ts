// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './createVueApp'
import { getPageTitle } from './getPageTitle'
import type { OnRenderClientAsync } from 'vike/types'

let app: ReturnType<typeof createVueApp>
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  if (!app) {
    app = createVueApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}
