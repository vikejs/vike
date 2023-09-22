// https://vike.dev/onRenderClient
export default onRenderClient

import { createApp } from './app'

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const { app, store } = createApp({ Page })
  store.replaceState(pageContext.INITIAL_STATE)
  app.mount('#app')
}
