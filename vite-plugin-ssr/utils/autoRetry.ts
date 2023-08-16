export { autoRetry }

import { sleep } from './sleep.js'

async function autoRetry(fn: () => void | Promise<void>, timeout: number): Promise<void> {
  const interval = 30
  const numberOfTries = timeout / interval
  let i = 0
  while (true) {
    try {
      await fn()
      return
    } catch (err) {
      i = i + 1
      if (i > numberOfTries) {
        throw err
      }
    }
    await sleep(interval)
  }
}
