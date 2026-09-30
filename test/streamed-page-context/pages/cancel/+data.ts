export { data }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Counts the cancellations, see /status
function data() {
  return {
    ticks: (async function* () {
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

declare global {
  var __cancelCount: undefined | number
}
