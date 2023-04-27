// https://vite-plugin-ssr.com/onRenderClient
export default onRenderClient

import { createApp } from './app'

async function onRenderClient(pageContext) {
  const app = createApp(pageContext)
  app.mount('#app')
}
