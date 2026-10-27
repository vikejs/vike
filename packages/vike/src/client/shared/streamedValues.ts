// Streamed pageContext values, client-side (see shared-server-client/streamedValues.ts): the lines that follow the
// serialized pageContext feed the values of a receiver (see ./streamedValues/registry.ts).
//
// Loaded only if the pageContext has streamed values (see getJsonSerializedInHtml.ts and
// ../runtime-client-routing/streamedValues.ts).

export { parsePageContextHtml }
export { readPageContextJsonStreamed }

import { parse } from '@brillout/json-serializer/parse'
import { assert } from '../../utils/assert.js'
import { isObject } from '../../utils/isObject.js'
import { createReceiver } from './streamedValues/registry.js'
import '../assertEnvClient.js'

// First render: the `<script>` tags that follow `<script id="vike_pageContext">` push the lines to `self.__vike_streamed`,
// before and after Vike's client runtime is loaded.
function parsePageContextHtml(pageContextJson: string, abortSignal?: AbortSignal): unknown {
  const receiver = createReceiver()
  const [pageContext] = parse(pageContextJson, { reviver: receiver.reviver }) as [unknown]
  const g = self as { __vike_streamed?: string[] | { push(line: string): void } }
  const linesQueued = Array.isArray(g.__vike_streamed) ? g.__vike_streamed : []
  g.__vike_streamed = {
    push(line: string) {
      // The user navigated away => the lines that the HTML still sends are ignored: the values still pending never resolve nor reject
      if (!abortSignal?.aborted) receiver.onLine(line)
    },
  }
  linesQueued.forEach(receiver.onLine)
  return pageContext
}

// Client-side navigation: the `.pageContext.json` response (see server/runtime/renderPageServer/getPageContextJson.ts),
// `[pageContext` then one `,line` per line then `]`. The pageContext is returned as soon as its line arrives.
async function readPageContextJsonStreamed(
  response: Response,
  abortSignal?: AbortSignal,
): Promise<Record<string, unknown>> {
  const reader = response.body!.getReader()
  const lines = readLines(reader)
  const { done, value: lineFirst } = await lines.next()
  assert(!done && lineFirst[0] === '[')
  const receiver = createReceiver()
  const pageContextFromServer = parse(lineFirst.slice(1), { reviver: receiver.reviver })
  assert(isObject(pageContextFromServer))
  ;(async () => {
    try {
      for await (const line of lines) {
        if (line !== ']') receiver.onLine(line.slice(1))
      }
      receiver.fail(new Error('The pageContext.json response ended before the streamed pageContext values ended'))
    } catch (err) {
      // Performance & UI: the user navigated away => the values still pending never resolve nor reject (improves performance as it saves the UI work and doesn't re-render..., and preventing the UI from updating is probably a UX improvement)
      if (abortSignal?.aborted) return
      // E.g. the server aborted the response
      receiver.fail(err)
    }
  })()
  return pageContextFromServer
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
