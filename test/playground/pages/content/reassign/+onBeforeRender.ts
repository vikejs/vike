export { onBeforeRender }

import type { PageContextServer } from 'vike/types'

function onBeforeRender(pageContext: PageContextServer) {
  pageContext.content = 'Same value'
}
