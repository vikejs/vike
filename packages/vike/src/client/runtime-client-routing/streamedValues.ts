// Streamed pageContext values https://vike.dev/passToClient#streaming, upon client-side navigation:
// - The `.pageContext.json` response has several lines if the pageContext has streamed values (see
//   server/runtime/renderPageServer/pageContextJson.ts): the decoder (../shared/streamedValues.ts) is loaded only then.
// - Vike owns the streamed values of a pageContext until it passes the pageContext to onRenderClient(): if it doesn't
//   (e.g. the navigation is superseded by another one), the values are cancelled and the response isn't read further.

export { readPageContextJson }
export { hasStreamedValues }
export { moveStreamedValues }
export { cancelStreamedValues }
export { releaseStreamedValues }

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
        const { pageContextFromServer, cancel } = readPageContextJsonStreamed(
          lineFirst,
          chunk.slice(lineEnd + 1),
          reader,
          decoder,
        )
        streamedValuesCancel.set(pageContextFromServer, cancel)
        return pageContextFromServer
      }
    }
    chunks.push(chunk)
    if (done) return parse(chunks.join(''))
  }
}

const streamedValuesCancel = new Map<object, () => void>()
function hasStreamedValues(pageContextFromServer: object): boolean {
  return streamedValuesCancel.has(pageContextFromServer)
}
/** The values of `from` are now referenced by `to` */
function moveStreamedValues(from: object, to: object): void {
  const cancel = streamedValuesCancel.get(from)
  if (!cancel) return
  streamedValuesCancel.delete(from)
  streamedValuesCancel.set(to, cancel)
}
/** Without argument: the values of all pageContexts not passed to onRenderClient() */
function cancelStreamedValues(pageContextFromServer?: object): void {
  const pageContexts = pageContextFromServer ? [pageContextFromServer] : [...streamedValuesCancel.keys()]
  pageContexts.forEach((pageContext) => {
    streamedValuesCancel.get(pageContext)?.()
    streamedValuesCancel.delete(pageContext)
  })
}
/** The pageContext is passed to onRenderClient() */
function releaseStreamedValues(pageContextFromServer: object): void {
  streamedValuesCancel.delete(pageContextFromServer)
}
