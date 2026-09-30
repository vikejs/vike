// The streamed pageContext values (see ../streamedValues.ts) of the HTML's `<script id="vike_pageContext">`: each line
// is sent as a `<script>` that pushes it to `self.__vike_streamed` (read by Vike's client runtime, see
// client/shared/streamedValues.ts).
// - HTML stream of react-streaming: the lines are injected into the stream as they're produced.
// - HTML stream: the lines produced while the stream is running are sent after it ends, and the lines produced
//   afterwards are sent as they're produced; the HTML ends once all values have ended.
// - HTML string: the lines are appended to the HTML once all values have ended.
// - Pre-rendering: the lines are also collected for `index.pageContext.json`, so that the values are read once.

export { sendStreamedValuesInHtml }
export { getStreamedValuesHtml }
export { writeStreamedValuesHtmlAtStreamEnd }
export { cancelStreamedValuesHtml }
export { getStreamedValuesLinesPrerendered }
export type { PageContextStreamedValuesHtml }

import { assert } from '../../../../utils/assert.js'
import { cancelStreamedValues, pumpStreamedValues, type StreamedValue } from '../streamedValues.js'
import { getPageContextClientSerialized, type PageContextSerialization } from './serializeContext.js'
import type { PageContextCreatedServer } from '../createPageContextServer.js'
import type { StreamFromReactStreamingPackage } from './stream/react-streaming.js'
import { inferNonceAttr, type PageContextCspNonce } from '../csp.js'
import { logRuntimeError } from '../../loggerRuntime.js'
import '../../../assertEnvServer.js'

type StreamedValuesHtml = {
  done: Promise<void>
  cancel: (reason?: unknown) => void
  /** The `<script>` tags not sent yet */
  pending: string[]
  /** Set while the HTML stream is ending */
  writeHtml: null | ((html: string) => void)
  /** Pre-rendering: all lines */
  lines: null | string[]
}
type PageContextStreamedValuesHtml = PageContextCreatedServer &
  PageContextCspNonce & {
    _requestId: number
    _streamedValuesHtml?: StreamedValuesHtml
    _streamedValuesHtmlIsCancelled?: true
  }
// No backpressure from the HTML stream: writing pauses now and then, so that a producer that never waits (e.g. an async
// generator yielding in a loop) doesn't block the event loop
const pauseEvery = 10 // milliseconds

function sendStreamedValuesInHtml(
  pageContext: PageContextStreamedValuesHtml,
  streamedValues: StreamedValue[],
  streamFromReactStreamingPackage: null | StreamFromReactStreamingPackage,
): void {
  // The pageContext is serialized once per HTML
  assert(!pageContext._streamedValuesHtml)
  if (streamedValues.length === 0) return
  const { isPrerendering } = pageContext
  let pausedAt = Date.now()
  const write = (line: string) => {
    streamedValuesHtml.lines?.push(line)
    const script = getScript(line, pageContext)
    if (streamedValuesHtml.writeHtml) {
      streamedValuesHtml.writeHtml(script)
    } else if (
      streamedValuesHtml.pending.length === 0 &&
      streamFromReactStreamingPackage &&
      !streamFromReactStreamingPackage.hasStreamEnded()
    ) {
      streamFromReactStreamingPackage.injectToStream(script, { flush: true })
    } else {
      streamedValuesHtml.pending.push(script)
    }
    if (Date.now() - pausedAt < pauseEvery) return
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        pausedAt = Date.now()
        resolve()
      }),
    )
  }
  const pump = pumpStreamedValues(pageContext, streamedValues, write, {
    // A pre-rendered page can't have a failed value
    failFast: isPrerendering,
    onError: (err) => logRuntimeError(err, pageContext),
  })
  const streamedValuesHtml: StreamedValuesHtml = {
    done: pump.done,
    cancel: pump.cancel,
    pending: [],
    writeHtml: null,
    lines: isPrerendering ? [] : null,
  }
  // Pre-rendering: the error is thrown by getStreamedValuesLinesPrerendered()
  streamedValuesHtml.done.catch(() => {})
  pageContext._streamedValuesHtml = streamedValuesHtml
  if (pageContext._streamedValuesHtmlIsCancelled) pump.cancel()
}

// HTML string
async function getStreamedValuesHtml(pageContext: PageContextStreamedValuesHtml): Promise<null | string> {
  const streamedValuesHtml = pageContext._streamedValuesHtml
  if (!streamedValuesHtml) return null
  await streamedValuesHtml.done.catch(() => {})
  return streamedValuesHtml.pending.join('')
}

// HTML stream: `htmlEnd` is what Vike appends after the HTML stream ended. The lines are sent before `</body>`.
async function writeStreamedValuesHtmlAtStreamEnd(
  pageContext: PageContextStreamedValuesHtml,
  htmlEnd: string,
  writeHtml: (html: string) => void,
): Promise<string> {
  const streamedValuesHtml = pageContext._streamedValuesHtml
  if (!streamedValuesHtml) return htmlEnd
  let i = htmlEnd.lastIndexOf('</body>')
  if (i === -1) i = htmlEnd.length
  writeHtml(htmlEnd.slice(0, i) + streamedValuesHtml.pending.join(''))
  streamedValuesHtml.pending = []
  streamedValuesHtml.writeHtml = writeHtml
  await streamedValuesHtml.done.catch(() => {})
  streamedValuesHtml.writeHtml = null
  return htmlEnd.slice(i)
}

// The HTML response was cancelled (e.g. the user closed the tab) or failed
function cancelStreamedValuesHtml(
  pageContext: PageContextStreamedValuesHtml & PageContextSerialization & { _isHtmlOnly: boolean },
) {
  if (pageContext._streamedValuesHtmlIsCancelled) return
  pageContext._streamedValuesHtmlIsCancelled = true
  if (pageContext._streamedValuesHtml) return pageContext._streamedValuesHtml.cancel()
  // The pageContext isn't serialized yet: its streamed values are found by serializing it
  if (pageContext._isHtmlOnly) return
  let streamedValues: StreamedValue[]
  try {
    streamedValues = getPageContextClientSerialized(pageContext, true).streamedValues
  } catch {
    // Called by stream event handlers: a serialization error is shown when the pageContext is serialized for the HTML
    return
  }
  cancelStreamedValues(streamedValues)
}

// Pre-rendering: the lines for `index.pageContext.json` (the values are read once, while rendering the HTML)
async function getStreamedValuesLinesPrerendered(pageContext: PageContextStreamedValuesHtml): Promise<null | string[]> {
  const streamedValuesHtml = pageContext._streamedValuesHtml
  if (!streamedValuesHtml) return null
  await streamedValuesHtml.done
  assert(streamedValuesHtml.lines)
  return streamedValuesHtml.lines
}

function getScript(line: string, pageContext: PageContextCspNonce): string {
  // A JavaScript string literal: JSON.stringify() escapes quotes, backslashes and line breaks; `<` is escaped so that the
  // script never contains `</script>` nor `<!--`; `/` is escaped for the same reason as in `<script id="vike_pageContext">`
  // (https://github.com/vikejs/vike/pull/2603).
  const literal = JSON.stringify(line)
    .replaceAll('<', '\\u003c')
    .replaceAll('/', '\\/')
    .replaceAll(' ', '\\u2028')
    .replaceAll(' ', '\\u2029')
  return `<script${inferNonceAttr(pageContext)}>(self.__vike_streamed=self.__vike_streamed||[]).push(${literal})</script>`
}
