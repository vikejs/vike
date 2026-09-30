// The body of `.pageContext.json` requests (client-side navigation) and of pre-rendered `index.pageContext.json` files.
//
// - Without streamed pageContext values: the serialized pageContext, as is.
// - With streamed pageContext values (see streamedValues.ts): still one JSON value, written line by line so that the
//   client can read it while it streams:
//     {"pageId":"/pages/index","data":"!VikePromise:0","_streamedValues":[
//     {"s":0,"v":{"title":"Hello"}}
//     ]}
//   The first line is the serialized pageContext opening the `_streamedValues` array, each following line is an element
//   of that array (see streamedValues.ts), and the last line closes the array and the object. The client parses the
//   first line (closed with `]}`) as soon as it arrives.

export { getPageContextJson }
export { getPageContextJsonFile }

import { pumpStreamedValues, type StreamedValue } from './streamedValues.js'
import type { PageContext_logRuntime } from '../loggerRuntime.js'
import '../../assertEnvServer.js'

const lineLast = ']}'

function getPageContextJson(
  pageContextSerialized: string,
  streamedValues: StreamedValue[],
  pageContext: NonNullable<PageContext_logRuntime>,
): string | ReadableStream<Uint8Array> {
  if (streamedValues.length === 0) return pageContextSerialized
  return getBody(getLineFirst(pageContextSerialized), streamedValues, pageContext)
}

// Pre-rendering: the lines were collected while rendering the HTML (see html/streamedValuesHtml.ts)
function getPageContextJsonFile(pageContextSerialized: string, lines: null | string[]): string {
  if (!lines) return pageContextSerialized
  return [getLineFirst(pageContextSerialized), ...lines.map((line, i) => (i === 0 ? '' : ',') + line), lineLast]
    .map((line) => line + '\n')
    .join('')
}

function getLineFirst(pageContextSerialized: string): string {
  // Remove the closing `}`
  return `${pageContextSerialized.slice(0, -1)},"_streamedValues":[`
}

function getBody(
  lineFirst: string,
  streamedValues: StreamedValue[],
  pageContext: NonNullable<PageContext_logRuntime>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let pump: ReturnType<typeof pumpStreamedValues>
  let isCancelled = false
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const enqueue = (line: string) => controller.enqueue(encoder.encode(line + '\n'))
      // Sent right away: the client runs its hooks while the values are still being produced
      enqueue(lineFirst)
      let isFirstElement = true
      const write = (line: string) => {
        enqueue((isFirstElement ? '' : ',') + line)
        isFirstElement = false
      }
      pump = pumpStreamedValues(pageContext, streamedValues, write, { failFast: false })
      pump.done.then(
        () => {
          if (isCancelled) return
          enqueue(lineLast)
          controller.close()
        },
        (err) => controller.error(err),
      )
    },
    // E.g. the user navigated away
    cancel() {
      isCancelled = true
      pump.cancel()
    },
  })
}
