export { data }
export type Data = ReturnType<typeof data>

import type { PageContextServer } from 'vike/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// TEST: streamed pageContext values https://vike.dev/passToClient#streaming
function data(pageContext: PageContextServer) {
  const { search } = pageContext.urlParsed
  // The test chooses when a `?holdLast` generator produces its last chunk
  if (search.releaseLast !== undefined) releaseLast()
  return {
    // Would create an element if it weren't escaped
    promise: sleep(100).then(() => '</script><b id="unescaped">unescaped</b><!--'),
    generator: generator(search.holdLast !== undefined),
    // Bytes that aren't valid UTF-8
    bytes: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(Uint8Array.from({ length: 256 }, (_, i) => i))
        controller.close()
      },
    }),
    failing: sleep(100).then(() => {
      throw new Error('Streamed value failed on purpose')
    }),
  }
}

let releaseLast = () => {}

// Its first chunk arrives before its last chunk is produced
async function* generator(isLastHeld: boolean) {
  yield 'first'
  if (isLastHeld) await new Promise<void>((resolve) => (releaseLast = resolve))
  else await sleep(1000)
  yield 'last'
}
