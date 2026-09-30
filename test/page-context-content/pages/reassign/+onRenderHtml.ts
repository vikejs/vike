export { onRenderHtml }

import type { PageContextServer } from 'vike/types'
import { content } from './content'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = content
}
