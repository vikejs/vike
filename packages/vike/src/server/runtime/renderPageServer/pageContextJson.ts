// The body of `.pageContext.json` requests (client-side navigation) and of pre-rendered `index.pageContext.json` files.
//
// - Without streamed pageContext values: the serialized pageContext, as is.
// - With streamed pageContext values (see shared-server-client/streamedValues.ts): still one JSON value, written line
//   by line so that the client can read it while it streams:
//     {"pageId":"/pages/index","data":"!VikePromise:0","_streamedValues":[
//     {"s":0,"v":{"title":"Hello"}}
//     ]}
//   The first line is the serialized pageContext opening the `_streamedValues` array, each following line is an element
//   of that array, and the last line closes the array and the object. The client parses the first line (closed with
//   `]}`) as soon as it arrives.

export { getPageContextJson }
export { getPageContextJsonFile }

import { getPageContextClientSerialized, type PageContextSerialization } from './html/serializeContext.js'
import { pumpStreamedValues } from './streamedValues/pump.js'
import type { PageContext_logRuntime } from '../loggerRuntime.js'
import { pageContextJsonLinesBegin, pageContextJsonLinesEnd } from '../../../shared-server-client/streamedValues.js'
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
      enqueue(getLineFirst(pageContextSerialized))
      let i = 0
      const write = (line: string) => enqueue(getElement(line, i++))
      pump = pumpStreamedValues(pageContext, streamedValues, write, { failFast: false })
      pump.done.then(() => {
        if (isCancelled) return
        enqueue(pageContextJsonLinesEnd)
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
  return [getLineFirst(pageContextSerialized), ...lines.map(getElement), pageContextJsonLinesEnd]
    .map((line) => line + '\n')
    .join('')
}

function getLineFirst(pageContextSerialized: string): string {
  // Remove the closing `}`
  return pageContextSerialized.slice(0, -1) + pageContextJsonLinesBegin
}

// The lines of the streamed values are the elements of the `_streamedValues` array
function getElement(line: string, index: number): string {
  return (index === 0 ? '' : ',') + line
}
