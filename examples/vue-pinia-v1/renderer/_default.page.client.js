export { render }
export const clientRouting = true

import { createApp } from './app'

let app
function render(pageContext) {
  if (!app) {
    const instance = createApp(pageContext)
    app = instance.app
    instance.store.state.value = pageContext.initialStoreState
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
