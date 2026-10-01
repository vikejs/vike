// Streamed pageContext values https://vike.dev/passToClient#streaming, upon client-side navigation: the decoder
// (../shared/streamedValues.ts) is loaded only if the `.pageContext.json` response is a JSON array (see
// server/runtime/renderPageServer/pageContextJson.ts).

export { readPageContextJson }
export { cancelStreamedValues }

import { parse } from '@brillout/json-serializer/parse'
import '../assertEnvClient.js'

let decoder: undefined | typeof import('../shared/streamedValues.js')

async function readPageContextJson(response: Response): Promise<unknown> {
  const reader = response.clone().body!.getReader()
  let chunk = await reader.read()
  while (!chunk.done && !chunk.value.length) chunk = await reader.read()
  reader.cancel()
  // A pageContext always serializes as `{…}`, so an array (`[` is 91) means streamed values
  if (chunk.value?.[0] !== 91) return parse(await response.text())
  decoder ??= await import('../shared/streamedValues.js')
  return decoder.readPageContextJson(response)
}

function cancelStreamedValues(pageContext: object, isRendered: boolean): void {
  decoder?.cancelStreamedValues(pageContext, isRendered)
}
