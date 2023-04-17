export default onBeforeRender

import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

async function onBeforeRender(pageContext) {
  const app = createApp(pageContext, pageContext.apolloClient)
  const appHtml = await renderToString(app)
  const apolloInitialState = pageContext.apolloClient.extract()
  return {
    pageContext: {
      apolloInitialState,
      appHtml
    }
  }
}
