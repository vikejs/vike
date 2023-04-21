export { render }

import { createApp } from './app'

async function render(pageContext) {
  const { Page } = pageContext
  const { app, store } = createApp({ Page })
  store.replaceState(pageContext.INITIAL_STATE)
  app.mount('#app')
}
