export { catchInfiniteLoop }

import { assertUsage, assertWarning } from './assert.js'

const trackers = {} as Record<string, Tracker>

type Tracker = {
  count: number
  start: Date
  warned?: true
}

function catchInfiniteLoop(functionName: `${string}()`, maxNumberOfCalls = 100, withinSeconds = 5) {
  // Init
  const now = new Date()
  let tracker: Tracker = (trackers[functionName] ??= createTracker(now))

  // Reset
  const elapsedTime = now.getTime() - tracker.start.getTime()
  if (elapsedTime > withinSeconds * 1000) tracker = trackers[functionName] = createTracker(now)

  // Count
  tracker.count++

  // Error
  const msg = `[Infinite Loop] Rendering ${tracker.count} times within ${withinSeconds} seconds [${functionName}]`
  if (tracker.count > maxNumberOfCalls) {
    assertUsage(false, msg)
  }

  // Warning, at 50% threshold
  if (!tracker.warned && tracker.count > maxNumberOfCalls * 0.5) {
    // Warning is shown upon 10 calls a second, on average during 5 seconds, given the default parameters
    assertWarning(false, msg, { onlyOnce: false })
    tracker.warned = true
  }
}

function createTracker(now: Date): Tracker {
  const tracker = {
    count: 0,
    start: now
  }
  return tracker
}
