export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = new ReadableStream<Uint8Array>({
    start(controller) {
      // `é` is split across the two chunks
      controller.enqueue(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0xc3]))
      controller.enqueue(new Uint8Array([0xa9, 0x0a]))
      controller.close()
    },
  })
}
