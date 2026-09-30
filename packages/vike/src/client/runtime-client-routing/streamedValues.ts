// Streamed pageContext values https://vike.dev/passToClient#streaming, upon client-side navigation:
// - The `.pageContext.json` response has several lines if the pageContext has streamed values (see
//   server/runtime/renderPageServer/pageContextJson.ts): the decoder (../shared/streamedValues.ts) is loaded only then.
// - A new rendering cancels the streamed values fetched before it (the previous page's, or a superseded navigation's).

export { readPageContextJson }
export { cancelStreamedValues }

import { parse } from '@brillout/json-serializer/parse'
import '../assertEnvClient.js'

async function readPageContextJson(response: Response): Promise<unknown> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  // Joined once: searching the whole text upon each chunk would be quadratic
  const chunks: string[] = []
  let isFirstLine = true
  while (true) {
    const { done, value } = await reader.read()
    const chunk = decoder.decode(value, { stream: !done })
    const lineEnd = isFirstLine ? chunk.indexOf('\n') : -1
    if (lineEnd !== -1) {
      isFirstLine = false
      const lineFirst = chunks.join('') + chunk.slice(0, lineEnd)
      if (lineFirst.endsWith('"_streamedValues":[')) {
        const { readPageContextJsonStreamed } = await import('../shared/streamedValues.js')
        responsesStreaming.push(reader)
        return readPageContextJsonStreamed(lineFirst, chunk.slice(lineEnd + 1), reader, decoder)
      }
    }
    chunks.push(chunk)
    if (done) return parse(chunks.join(''))
  }
}

let responsesStreaming: ReadableStreamDefaultReader[] = []
function cancelStreamedValues(): void {
  responsesStreaming.forEach((reader) => reader.cancel().catch(() => {}))
  responsesStreaming = []
}
