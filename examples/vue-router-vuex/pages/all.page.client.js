export { render }

import { createApp } from './app'

async function render(pageContext) {
  const { Page } = pageContext
  const { app, router, store } = createApp({ Page })
  store.replaceState(pageContext.INITIAL_STATE)
  await router.isReady()
  app.mount('#app')
}
