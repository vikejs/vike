export { sleep }
export { ticks }

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// An endless async generator; /status counts how many were cancelled
async function* ticks() {
  try {
    while (true) {
      yield 'tick'
      await sleep(50)
    }
  } finally {
    globalThis.__cancelCount = (globalThis.__cancelCount ?? 0) + 1
  }
}
