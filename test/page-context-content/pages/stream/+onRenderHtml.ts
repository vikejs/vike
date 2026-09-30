export { onRenderHtml }

import type { PageContextServer } from 'vike/types'
import { waitForRelease } from './release'

// `é` is split across two chunks
const chunks = [new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0xc3]), new Uint8Array([0xa9, 0x0a])]

function onRenderHtml(pageContext: PageContextServer) {
  const { isPrerendering } = pageContext
  pageContext.content = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(chunks[0]!)
      // Upon SSR, the second chunk is held back until the test requests /stream-release.txt
      if (!isPrerendering) await waitForRelease()
      controller.enqueue(chunks[1]!)
      controller.close()
    },
  })
}
