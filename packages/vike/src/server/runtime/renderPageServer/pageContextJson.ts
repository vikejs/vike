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

import { assertUsage } from '../../../utils/assert.js'
import { pumpStreamedValues, type StreamedValue } from './streamedValues.js'
import { logRuntimeError } from '../loggerRuntime.js'
import pc from '@brillout/picocolors'
import '../../assertEnvServer.js'

type PageContextLog = NonNullable<Parameters<typeof logRuntimeError>[1]>
const streamedValuesKey = '_streamedValues'
const lineLast = ']}'

function getPageContextJson(
  pageContextSerialized: string,
  streamedValues: StreamedValue[],
  pageContext: PageContextLog,
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
  assertUsage(
    !(streamedValuesKey in JSON.parse(pageContextSerialized)),
    `${pc.cyan(`pageContext.${streamedValuesKey}`)} is reserved by Vike, remove it from ${pc.cyan('passToClient')}`,
  )
  // Remove the closing `}`
  const pageContextOpen = pageContextSerialized.slice(0, -1)
  return `${pageContextOpen},"${streamedValuesKey}":[`
}

// Backpressure: the values are read while the consumer's queue holds less than `highWaterMark` bytes. When the consumer
// goes away (e.g. the user navigated away), all values are cancelled.
const highWaterMark = 64 * 1024
function getBody(
  lineFirst: string,
  streamedValues: StreamedValue[],
  pageContext: PageContextLog,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let isFirstElement = true
  let isCancelled = false
  let waiting: (() => void)[] = []
  const wake = () => {
    waiting.forEach((resolve) => resolve())
    waiting = []
  }
  let pump: ReturnType<typeof pumpStreamedValues>
  return new ReadableStream<Uint8Array>(
    {
      start(controller) {
        // Sent right away: the client runs its hooks while the values are still being produced
        controller.enqueue(encoder.encode(lineFirst + '\n'))
        const write = async (line: string) => {
          controller.enqueue(encoder.encode((isFirstElement ? '' : ',') + line + '\n'))
          isFirstElement = false
          while (!isCancelled && controller.desiredSize! <= 0) {
            await new Promise<void>((resolve) => waiting.push(resolve))
          }
        }
        pump = pumpStreamedValues(pageContext, streamedValues, write, {
          failFast: false,
          onError: (err) => logRuntimeError(err, pageContext),
        })
        pump.done.then(
          () => {
            if (isCancelled) return
            controller.enqueue(encoder.encode(lineLast + '\n'))
            controller.close()
          },
          (err) => {
            if (!isCancelled) controller.error(err)
          },
        )
      },
      pull() {
        wake()
      },
      cancel(reason) {
        isCancelled = true
        wake()
        pump.cancel(reason)
      },
    },
    new ByteLengthQueuingStrategy({ highWaterMark }),
  )
}
