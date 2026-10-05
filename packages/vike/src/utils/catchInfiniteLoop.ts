export { catchInfiniteLoop }

import { assertUsage, assertWarning } from './assert.js'
import { humanizeTime } from './humanizeTime.js'

const trackers = new Map<string, Tracker>()
let lastCleanup = 0

type Tracker = {
  count: number
  startTime: number
  warned?: true
}

const maxCalls = 99
const time = 5 * 1000

function catchInfiniteLoop(functionName: `${string}()`) {
  // Init
  const now = new Date().getTime()

  // Clean outdated trackers. Not upon every call: the server creates a tracker per request, so that would cost O(requests within `time`) per request.
  // Math.abs() so that cleaning resumes right away if the clock went backwards.
  if (Math.abs(now - lastCleanup) > time) {
    trackers.forEach((tracker, key) => {
      if (isOutdated(tracker, now)) trackers.delete(key)
    })
    lastCleanup = now
  }

  // The tracker may be outdated but not cleaned yet
  let tracker = trackers.get(functionName)
  if (!tracker || isOutdated(tracker, now)) {
    tracker = { count: 0, startTime: now }
    trackers.set(functionName, tracker)
  }

  // Count
  tracker.count++

  // Error
  const msg = `${functionName} called ${tracker.count} times within ${humanizeTime(time)} — infinite loop?` as const
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

function isOutdated(tracker: Tracker, now: number) {
  return now - tracker.startTime > time
}
