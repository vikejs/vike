export { data }
export type Data = ReturnType<typeof data>

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// TEST: streamed pageContext values https://vike.dev/passToClient#streaming
function data() {
  return {
    // Would create an element if it weren't escaped
    promise: sleep(100).then(() => '</script><b id="unescaped">unescaped</b><!--'),
    generator: generator(),
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

// Its first chunk arrives before its last chunk is produced
async function* generator() {
  yield 'first'
  await sleep(1000)
  yield 'last'
}
