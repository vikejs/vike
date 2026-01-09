export { catchInfiniteLoop }

import { assertUsage, assertWarning } from './assert.js'
import { humanizeTime } from './humanizeTime.js'

const trackers = {} as Record<string, Tracker>

type Tracker = {
  count: number
  startTime: number
  warned?: true
}

const maxCalls = 100
const time = 5 * 1000

function catchInfiniteLoop(functionName: `${string}()`) {
  // Init
  const now = new Date().getTime()

  // Clean all outdated trackers
  Object.keys(trackers).forEach((key) => {
    const tracker = trackers[key]!
    const elapsedTime = now - tracker.startTime
    if (elapsedTime > time) delete trackers[key]
  })

  const tracker = (trackers[functionName] ??= { count: 0, startTime: now })

  // Count
  tracker.count++

  // Error
  const msg = `[Infinite Loop] ${functionName} called ${tracker.count} times within ${humanizeTime(time)}`
  if (tracker.count > maxCalls) {
    assertUsage(false, msg)
  }

  // Warning, at 50% threshold
  if (!tracker.warned && tracker.count > maxCalls * 0.5) {
    // Warning is shown upon 10 calls a second, on average during 5 seconds, given the default parameters
    assertWarning(false, msg, { onlyOnce: false, showStackTrace: true })
    tracker.warned = true
  }
}
