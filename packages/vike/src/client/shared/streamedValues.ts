// Streamed pageContext values, client-side (see shared-server-client/streamedValues.ts): the lines that follow the
// serialized pageContext feed the values of a receiver (see ./streamedValues/registry.ts).
//
// Loaded only if the pageContext has streamed values (see getJsonSerializedInHtml.ts and
// ../runtime-client-routing/streamedValues.ts).

export { parsePageContextHtml }
export { parsePageContextJson }

import { parse } from '@brillout/json-serializer/parse'
import { pageContextJsonLinesEnd } from '../../shared-server-client/streamedValues.js'
import { assert } from '../../utils/assert.js'
import { isObject } from '../../utils/isObject.js'
import { createReceiver } from './streamedValues/registry.js'
import '../assertEnvClient.js'

// First render: the `<script>` tags that follow `<script id="vike_pageContext">` push the lines to `self.__vike_streamed`,
// before and after Vike's client runtime is loaded.
function parsePageContextHtml(pageContextJson: string): unknown {
  const receiver = createReceiver()
  const pageContext = parse(pageContextJson, { reviver: receiver.reviver })
  const g = self as { __vike_streamed?: string[] | { push(line: string): void } }
  const linesQueued = Array.isArray(g.__vike_streamed) ? g.__vike_streamed : []
  g.__vike_streamed = { push: receiver.onLine }
  linesQueued.forEach(receiver.onLine)
  return pageContext
}

// Client-side navigation: the `.pageContext.json` response (see server/runtime/renderPageServer/pageContextJson.ts). Its
// first line is parsed right away; the following lines are the elements of `_streamedValues`.
function parsePageContextJson(lineFirst: string, lines: AsyncIterable<string>): Record<string, unknown> {
  const receiver = createReceiver()
  const pageContextFromServer = parse(lineFirst + pageContextJsonLinesEnd, { reviver: receiver.reviver })
  assert(isObject(pageContextFromServer))
  delete pageContextFromServer._streamedValues
  ;(async () => {
    try {
      for await (const line of lines) {
        if (line !== pageContextJsonLinesEnd) receiver.onLine(line.startsWith(',') ? line.slice(1) : line)
      }
      receiver.fail(new Error('The pageContext.json response ended before the streamed pageContext values ended'))
    } catch (err) {
      // E.g. the server aborted the response
      receiver.fail(err)
    }
  })()
  return pageContextFromServer
}
