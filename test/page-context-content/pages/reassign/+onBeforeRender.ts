export { onBeforeRender }

import type { PageContextServer } from 'vike/types'
import { content } from './content'

function onBeforeRender(pageContext: PageContextServer) {
  pageContext.content = content
}
