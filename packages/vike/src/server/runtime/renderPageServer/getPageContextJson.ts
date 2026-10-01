// The body of `.pageContext.json` requests (client-side navigation) and of pre-rendered `index.pageContext.json` files.
//
// - Without streamed pageContext values: the serialized pageContext, as is.
// - With streamed pageContext values (see shared-server-client/streamedValues.ts): a JSON array, written line by line
//   so that the client can read it while it streams:
//     [{"pageId":"/pages/index","data":"!VikePromise:0"}
//     ,{"s":0,"v":{"title":"Hello"}}
//     ]

export { getPageContextJson }
export { getPageContextJsonFile }

import { getPageContextClientSerialized, type PageContextSerialization } from './html/serializeContext.js'
import { pumpStreamedValues } from './streamedValues/pump.js'
import type { PageContext_logRuntime } from '../loggerRuntime.js'
import '../../assertEnvServer.js'

type PageContextForJson = PageContextSerialization & NonNullable<PageContext_logRuntime>
const textEncoder = new TextEncoder()

function getPageContextJson(pageContext: PageContextForJson): string | ReadableStream<Uint8Array> {
  const { pageContextSerialized, streamedValues } = getPageContextClientSerialized(pageContext, false)
  if (streamedValues.length === 0) return pageContextSerialized
  let pump: ReturnType<typeof pumpStreamedValues>
  let isCancelled = false
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const enqueue = (line: string) => controller.enqueue(textEncoder.encode(line + '\n'))
      // Sent right away: the client runs its hooks while the values are still being produced
      enqueue('[' + pageContextSerialized)
      pump = pumpStreamedValues(pageContext, streamedValues, (line) => enqueue(',' + line), { failFast: false })
      pump.done.then(() => {
        if (isCancelled) return
        enqueue(']')
        controller.close()
      })
    },
    // E.g. the user navigated away
    cancel() {
      isCancelled = true
      pump.cancel()
    },
  })
}

// Pre-rendering: the lines were collected while rendering the HTML (see html/streamedValuesHtml.ts)
function getPageContextJsonFile(pageContext: PageContextSerialization, lines: null | string[]): string {
  const { pageContextSerialized } = getPageContextClientSerialized(pageContext, false)
  if (!lines) return pageContextSerialized
  return ['[' + pageContextSerialized, ...lines.map((line) => ',' + line), ']'].map((line) => line + '\n').join('')
}
