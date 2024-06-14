export default onBeforeRender

import { renderToString } from '@vue/server-renderer'
import { createVueApp } from './createVueApp'

async function onBeforeRender(pageContext) {
  const app = createVueApp(pageContext, pageContext.apolloClient)
  const appHtml = await renderToString(app)
  const apolloInitialState = pageContext.apolloClient.extract()
  return {
    pageContext: {
      apolloInitialState,
      appHtml
    }
  }
}
