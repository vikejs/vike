// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './createVueApp'

async function onRenderClient(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
