import { afterAll, beforeAll, test, vi } from 'vitest'
import { catchInfiniteLoop } from './catchInfiniteLoop.js'

// The server calls catchInfiniteLoop() once per request, with a key unique to the request
let now = 0
let requestId = 0
function renderRequest(reqPerSec: number) {
  now += 1000 / reqPerSec
  vi.setSystemTime(now)
  catchInfiniteLoop(`[request-${requestId++}] renderPageServerEntryRecursive()`)
}

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
})
afterAll(() => {
  vi.useRealTimers()
})

for (const reqPerSec of [100, 1000, 5000]) {
  test(`server at ${reqPerSec} req/s`, async ({ bench }) => {
    // Reach the steady state: one tracker per request of the last 5 seconds
    for (let i = 0; i < reqPerSec * 6; i++) renderRequest(reqPerSec)
    await bench(`catchInfiniteLoop() at ${reqPerSec} req/s`, () => renderRequest(reqPerSec)).run()
  })
}
