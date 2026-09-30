export { onRenderHtml }

import type { PageContextServer } from 'vike/types'
import { release } from '../stream/release'

function onRenderHtml(pageContext: PageContextServer) {
  release()
  pageContext.content = 'released'
}
