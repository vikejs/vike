export { installUncaughtErrorHandlers }

import { getGlobalObject } from './getGlobalObject.js'

const globalObject = getGlobalObject('./installUncaughtErrorHandlers.ts', {
  installed: false,
})

// Avoid server shutdown upon uncaught errors, e.g. `setTimeout(() => throw new Error('Uncaught error'), 10)`
// If in the future we want to call +onError then let's use different handlers
function installUncaughtErrorHandlers() {
  if (globalObject.installed) return
  globalObject.installed = true
  if (typeof process === 'undefined') return
  process?.addListener?.('uncaughtException', (err) => {
    console.error(err)
    // Writing to stdout/stderr fails if, for example, the terminal was closed — exit like Node.js does by default, otherwise the console.error() above fails again and re-triggers this handler, endlessly.
    // https://github.com/vikejs/vike/issues/3577
    if (isWriteError(err)) process.exit(1)
  })
  process?.addListener?.('unhandledRejection', (err) => {
    console.error(err)
  })
}

function isWriteError(err: unknown) {
  const { syscall, code } = (err ?? {}) as NodeJS.ErrnoException
  return syscall === 'write' && (code === 'EPIPE' || code === 'EIO')
}
