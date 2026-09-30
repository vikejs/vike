export { data }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Random values: if the page were rendered twice, the HTML and index.pageContext.json would differ
function data() {
  return {
    random: String(Math.random()),
    promise: sleep(100).then(() => ({ random: String(Math.random()) })),
    generator: (async function* () {
      yield String(Math.random())
      await sleep(100)
      yield Uint8Array.from({ length: 256 }, (_, i) => i)
    })(),
  }
}
