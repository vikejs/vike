export { data }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// An endless feed: cancelled when the user leaves the page (counted by /status)
function data() {
  return {
    feed: (async function* () {
      try {
        while (true) {
          yield 'tick'
          await sleep(50)
        }
      } finally {
        globalThis.__cancelCount = (globalThis.__cancelCount ?? 0) + 1
      }
    })(),
  }
}
