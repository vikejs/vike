// https://vite-plugin-ssr.com/onRenderClient
export default onRenderClient

import { createApp } from './app'

let app
function onRenderClient(pageContext) {
  if (!app) {
    const instance = createApp(pageContext)
    app = instance.app
    instance.store.state.value = pageContext.initialStoreState
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
