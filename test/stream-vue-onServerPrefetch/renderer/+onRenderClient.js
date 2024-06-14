// https://vike.dev/onRenderClient
export default onRenderClient

import { createVueApp } from './app'

let app
function onRenderClient(pageContext) {
  if (!app) {
    const instance = createVueApp(pageContext)
    app = instance.app
    instance.store.state.value = pageContext.initialStoreState
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
