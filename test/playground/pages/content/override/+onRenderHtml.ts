export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = JSON.stringify({ version: 'https://jsonfeed.org/version/1.1' })
}
