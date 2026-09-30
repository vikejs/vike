export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.error(new Error('Some stream error'))
    },
  })
}
