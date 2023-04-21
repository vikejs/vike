export { render }

import { createApp } from './app'

async function render(pageContext) {
  const { Page } = pageContext
  const { app, router } = createApp({ Page })
  await router.isReady()
  app.mount('#app')
}
