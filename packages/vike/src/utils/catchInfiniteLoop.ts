export { catchInfiniteLoop }

import { assertUsage, assertWarning } from './assert.js'
import { humanizeTime } from './humanizeTime.js'

const trackers = {} as Record<string, Tracker>

type Tracker = {
  count: number
  start: Date
  warned?: true
}

const maxNumberOfCalls = 100
const withinSeconds = 5

// TODO/ai
function catchInfiniteLoop(functionName: `${string}()`) {
  // Init
  const now = new Date()
  let tracker: Tracker = (trackers[functionName] ??= createTracker(now))

  // Reset
  const elapsedTime = now.getTime() - tracker.start.getTime()
  if (elapsedTime > withinSeconds * 1000) tracker = trackers[functionName] = createTracker(now)

  // Count
  tracker.count++

  // Error
  const msg = `[Infinite Loop] ${functionName} called ${tracker.count} times within ${humanizeTime(withinSeconds)}`
  if (tracker.count > maxNumberOfCalls) {
    assertUsage(false, msg)
  }

  // Warning, at 50% threshold
  if (!tracker.warned && tracker.count > maxNumberOfCalls * 0.5) {
    // Warning is shown upon 10 calls a second, on average during 5 seconds, given the default parameters
    assertWarning(false, msg, { onlyOnce: false, showStackTrace: true })
    tracker.warned = true
  }
}

function createTracker(now: Date): Tracker {
  const tracker = {
    count: 0,
    start: now,
  }
  return tracker
}
