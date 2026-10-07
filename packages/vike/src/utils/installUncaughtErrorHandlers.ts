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
  })
  process?.addListener?.('unhandledRejection', (err) => {
    console.error(err)
  })
  exitOnBrokenStdio()
}

// After the terminal is closed, writing to stdout/stderr fails (e.g. `write EIO`) and, since the error is uncaught, Node.js exits. But our handlers above catch it: the process would never exit (keeping its ports occupied) while endlessly logging the error, as logging it fails again.
// https://github.com/vikejs/vike/issues/3577
function exitOnBrokenStdio() {
  let streams: NodeJS.WriteStream[]
  try {
    streams = [process.stdout, process.stderr]
  } catch {
    // Some non-Node.js runtimes don't implement process.stdout
    return
  }
  streams.forEach((stream) => {
    stream?.on?.('error', (err) => {
      // The user handles the error
      if (stream.listenerCount('error') > 1) return
      // Same as Node.js's default behavior
      console.error(err)
      process.exit(1)
    })
  })
}
