export { onRenderHtml }

import type { PageContextServer } from 'vike/types'
import { bytes } from './bytes'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = bytes
}
