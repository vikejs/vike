export { data }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function data() {
  return {
    plain: 'plain value',
    // A slow Promise
    slow: sleep(1000).then(() => 'slow value'),
    // An async generator: its first chunk should arrive before its last chunk is produced
    generator: generator(),
    // Bytes that aren't valid UTF-8, and bytes that are
    bytes: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(Uint8Array.from({ length: 256 }, (_, i) => i))
        controller.enqueue(new TextEncoder().encode('héllo'))
        controller.close()
      },
    }),
    // A stream that fails mid-way: only this value fails
    failing: failing(),
    xss: Promise.resolve('</script><script>window.__xss = true</script><!--'),
    nested: sleep(200).then(() => ({ inner: sleep(200).then(() => ['deep', Promise.resolve('deeper')]) })),
  }
}

async function* generator() {
  yield { label: 'first', producedAt: Date.now() }
  await sleep(1500)
  yield { label: 'last', producedAt: Date.now() }
}

function failing() {
  let i = 0
  return new ReadableStream<string>({
    async pull(controller) {
      if (i++ === 0) {
        controller.enqueue('before error')
      } else {
        await sleep(100)
        controller.error(new Error('Stream failed on purpose'))
      }
    },
  })
}
