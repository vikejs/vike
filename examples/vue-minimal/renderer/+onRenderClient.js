// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './app'

async function onRenderClient(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
