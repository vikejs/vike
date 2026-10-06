export { catchInfiniteLoop }

import { assert, assertUsage, assertWarning } from './assert.js'
import { humanizeTime } from './humanizeTime.js'

const trackers = new Map<string, Tracker>()
let lastCleanup = 0

// Given these parameters, warning is shown upon 10 calls a second on average during 5 seconds
const maxCalls = 99
const time = 5 * 1000

type Tracker = {
  count: number
  startTime: number
  warned?: true
}

function catchInfiniteLoop(functionName: `${string}()`) {
  // Init
  const now = new Date().getTime()

  if (globalThis.__VIKE__IS_CLIENT) {
    // No cleanup on the client-side, in order to minimize client-side JavaScript (to save client-side KBs)
    assert(trackers.size < 5)
  } else {
    // Clean outdated trackers.
    // - On the server-side, there is an infinite amount of outdated trackers (a new tracker is created per HTTP request) => we should clean them
    // - Not upon every call: the server creates a new tracker per HTTP request, so that would cost O(n^2) — O(number of requests within `time`) per request
    const cleanInterval = 5 * 1000
    if (now - lastCleanup > cleanInterval) {
      trackers.forEach((tracker, key) => {
        if (isOutdated(tracker, now)) trackers.delete(key)
      })
      lastCleanup = now
    }
  }

  // Get/reset tracker
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
    assertWarning(false, msg, { onlyOnce: false, showStackTrace: true })
    tracker.warned = true
  }
}

function isOutdated(tracker: Tracker, now: number) {
  return now - tracker.startTime > time
}
