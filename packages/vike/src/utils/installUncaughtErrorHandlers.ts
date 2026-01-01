export { installUncaughtErrorHandlers }

import { getGlobalObject } from './getGlobalObject.js'

const globalObject = getGlobalObject('./installUncaughtErrorHandlers.ts', {
  installed: false,
})

// Avoid server shutdown upon uncaught errors, e.g. `setTimeout(() => throw new Error('Uncaught error'), 10)`
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
}
