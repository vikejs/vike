export { onBeforeRender }

import type { PageContextServer } from 'vike/types'

// A `pageContext.content` that isn't set by the render hook isn't the content: the page renders HTML
function onBeforeRender(pageContext: PageContextServer) {
  pageContext.content = 'Set by onBeforeRender()'
}
