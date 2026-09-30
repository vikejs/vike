export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode('hello'))
      await new Promise((r) => setTimeout(r, 100))
      controller.error(new Error('Some late stream error'))
    },
  })
}
