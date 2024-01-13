// https://vike.dev/onRenderClient
export { onRenderClient }

import { createApp } from './app'
import type { OnRenderClientAsync } from 'vike/types'

// This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
// to support SPA
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, data } = pageContext
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
  const app = createApp(Page, data, pageContext)
  app.mount('#app')
}
