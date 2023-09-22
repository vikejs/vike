// https://vike.dev/onBeforeRender
export default onBeforeRender

import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

async function onBeforeRender(pageContext) {
  const { Page } = pageContext
  const { app, store } = createApp({ Page })

  const appHtml = await renderToString(app)

  const INITIAL_STATE = store.state

  return {
    pageContext: {
      INITIAL_STATE,
      appHtml
    }
  }
}
