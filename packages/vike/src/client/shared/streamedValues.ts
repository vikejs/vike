// Streamed pageContext values, client-side (see shared-server-client/streamedValues.ts): the lines that follow the
// serialized pageContext feed the values of a receiver (see ./streamedValues/registry.ts).
//
// Loaded only if the pageContext has streamed values (see getJsonSerializedInHtml.ts and
// ../runtime-client-routing/streamedValues.ts).

export { parsePageContextHtml }
export { readPageContextJsonStreamed }
export { cancelStreamedValues }

import { parse } from '@brillout/json-serializer/parse'
import { assert } from '../../utils/assert.js'
import { isObject } from '../../utils/isObject.js'
import { createReceiver } from './streamedValues/registry.js'
import '../assertEnvClient.js'

// First render: the `<script>` tags that follow `<script id="vike_pageContext">` push the lines to `self.__vike_streamed`,
// before and after Vike's client runtime is loaded.
function parsePageContextHtml(pageContextJson: string): unknown {
  const receiver = createReceiver()
  const [pageContext] = parse(pageContextJson, { reviver: receiver.reviver }) as [unknown]
  const g = self as { __vike_streamed?: string[] | { push(line: string): void } }
  const linesQueued = Array.isArray(g.__vike_streamed) ? g.__vike_streamed : []
  g.__vike_streamed = { push: receiver.onLine }
  linesQueued.forEach(receiver.onLine)
  return pageContext
}

// Client-side navigation: the `.pageContext.json` response (see server/runtime/renderPageServer/getPageContextJson.ts),
// `[pageContext` then one `,line` per line then `]`. The pageContext is returned as soon as its line arrives.
async function readPageContextJsonStreamed(response: Response): Promise<Record<string, unknown>> {
  const reader = response.body!.getReader()
  const lines = readLines(reader)
  const { done, value: lineFirst } = await lines.next()
  assert(!done && lineFirst[0] === '[')
  const receiver = createReceiver()
  const pageContextFromServer = parse(lineFirst.slice(1), { reviver: receiver.reviver })
  assert(isObject(pageContextFromServer))
  responsesStreaming.push(reader)
  ;(async () => {
    try {
      for await (const line of lines) {
        if (line !== ']') receiver.onLine(line.slice(1))
      }
      receiver.fail(new Error('The pageContext.json response ended before the streamed pageContext values ended'))
    } catch (err) {
      // E.g. the server aborted the response
      receiver.fail(err)
    }
  })()
  return { ...pageContextFromServer, _streamedValuesReader: reader }
}

async function* readLines(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<string> {
  const decoder = new TextDecoder()
  // Joined once per line: joining upon each chunk would be quadratic
  let parts: string[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) return
    const chunk = decoder.decode(value, { stream: true })
    let lineStart = 0
    let lineEnd: number
    while ((lineEnd = chunk.indexOf('\n', lineStart)) !== -1) {
      yield parts.join('') + chunk.slice(lineStart, lineEnd)
      parts = []
      lineStart = lineEnd + 1
    }
    parts.push(chunk.slice(lineStart))
  }
}

// Once a page is rendered, the streamed values fetched before it are cancelled (the previous page's, and superseded
// navigations'): the previous page keeps its values while it's shown.
let responsesStreaming: ReadableStreamDefaultReader[] = []
// Cancels the streamed values of `pageContext` (a superseded navigation), or, once `pageContext` is rendered, all the others
function cancelStreamedValues(pageContext: object, isRendered: boolean): void {
  const { _streamedValuesReader } = pageContext as { _streamedValuesReader?: ReadableStreamDefaultReader }
  responsesStreaming = responsesStreaming.filter((reader) => {
    if ((reader === _streamedValuesReader) === isRendered) return true
    reader.cancel().catch(() => {})
    return false
  })
}
