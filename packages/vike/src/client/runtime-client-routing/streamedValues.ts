// Streamed pageContext values https://vike.dev/passToClient#streaming, upon client-side navigation:
// - The `.pageContext.json` response has several lines if the pageContext has streamed values (see
//   server/runtime/renderPageServer/pageContextJson.ts): the decoder (../shared/streamedValues.ts) is loaded only then.
// - A new rendering cancels the streamed values fetched before it (the previous page's, or a superseded navigation's).

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
    return parsePageContextJson(text, lines)
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
function cancelStreamedValues(): void {
  responsesStreaming.forEach((reader) => reader.cancel().catch(() => {}))
  responsesStreaming = []
}
