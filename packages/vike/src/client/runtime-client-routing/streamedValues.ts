// Streamed pageContext values https://vike.dev/passToClient#streaming, upon client-side navigation:
// - The `.pageContext.json` response has several lines if the pageContext has streamed values (see
//   server/runtime/renderPageServer/pageContextJson.ts): the decoder (../shared/streamedValues.ts) is loaded only then.
// - Once a page is rendered, the streamed values fetched before it are cancelled (the previous page's, and superseded
//   navigations'): the previous page keeps its values while it's shown.

export { readPageContextJson }
export { cancelStreamedValues }

import { parse } from '@brillout/json-serializer/parse'
import { pageContextJsonLinesBegin } from '../../shared-server-client/streamedValues.js'
import '../assertEnvClient.js'

async function readPageContextJson(response: Response): Promise<unknown> {
  const reader = response.body!.getReader()
  const lines = readLines(reader)
  let { done, value: text } = await lines.next()
  if (!done && text.endsWith(pageContextJsonLinesBegin)) {
    const { parsePageContextJson } = await import('../shared/streamedValues.js')
    responsesStreaming.push(reader)
    return { ...parsePageContextJson(text, lines), _streamedValuesReader: reader }
  }
  // Without streamed values: one JSON value
  while (!done) {
    const next = await lines.next()
    text += '\n' + next.value
    done = next.done
  }
  return parse(text)
}

// Yields the lines, and returns the text after the last line break
async function* readLines(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<string, string> {
  const decoder = new TextDecoder()
  // Joined once per line: joining upon each chunk would be quadratic
  let parts: string[] = []
  while (true) {
    const { done, value } = await reader.read()
    const chunk = decoder.decode(value, { stream: !done })
    let lineStart = 0
    let lineEnd: number
    while ((lineEnd = chunk.indexOf('\n', lineStart)) !== -1) {
      yield parts.join('') + chunk.slice(lineStart, lineEnd)
      parts = []
      lineStart = lineEnd + 1
    }
    parts.push(chunk.slice(lineStart))
    if (done) return parts.join('')
  }
}

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
