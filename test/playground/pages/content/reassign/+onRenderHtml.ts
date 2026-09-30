export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = 'Same value'
}
