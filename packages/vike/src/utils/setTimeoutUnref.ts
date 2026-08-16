export { setTimeoutUnref }

// Same as setTimeout() but the timer never keeps the Node.js process alive (e.g. upon programmatic dev server usage that exits quickly, the process shouldn't linger because of some pending bookkeeping timer).
//  - https://nodejs.org/api/timers.html#timeoutunref
//  - Only use it for auxiliary timers (bookkeeping, diagnostics, background work) — never for:
//    - Timers that resume the main flow (e.g. sleep()): the process could exit before the timer fires.
//    - Watchdog timers (e.g. hooksTimeout, genPromise() timeout): their purpose is to fire when everything else hangs — being the last thing that keeps the process alive is their job (without them Node.js would silently exit with code 0).
function setTimeoutUnref(callback: () => void, milliseconds: number): ReturnType<typeof setTimeout> {
  const timeout = setTimeout(callback, milliseconds)
  // In the browser (and, e.g., Cloudflare Workers) the timer is a number => there isn't any unref() method (nor any process to keep alive).
  ;(timeout as unknown as { unref?: () => unknown }).unref?.()
  return timeout
}
