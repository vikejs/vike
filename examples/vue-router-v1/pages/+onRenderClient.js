// https://vike.dev/onRenderClient
export default onRenderClient

import { createApp } from './app'

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const { app, router } = createApp({ Page })
  await router.isReady()
  app.mount('#app')
}
