// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './createVueApp'
import { getPageTitle } from './getPageTitle'
import type { PageContextClient } from 'vike/types'

let app: ReturnType<typeof createVueApp>
const onRenderClient = async (pageContext: PageContextClient) => {
  if (!app) {
    app = createVueApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}
