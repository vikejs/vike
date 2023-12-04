// https://vike.dev/onRenderClient
export { onRenderClient }

import { createApp } from './app'

// This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
// to support SPA
async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
  const app = createApp(Page, pageProps, pageContext)
  app.mount('#app')
}
