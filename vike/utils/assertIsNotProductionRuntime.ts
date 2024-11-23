// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProductionRuntime }
export { markEnvAsViteDev }
export { markEnvAsVitePreview }
export { markEnvAsVikePluginLoaded }
export { assertEnv }
export { vikeVitePluginLoadedInProductionError }

import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { createDebugger } from './debug.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isVitest } from './isVitest.js'
assertIsNotBrowser()
const debug = createDebugger('vike:setup')
const vikeVitePluginLoadedInProductionError = `Loading Vike's Vite plugin (the vike/plugin module) is prohibited in production.`

const env = getGlobalObject<{
  shouldNotBeProduction?: true
  isViteDev?: true
  isVitePreview?: true
  isVikePluginLoaded?: true
}>('utils/assertIsNotProductionRuntime.ts', {})

// Called by Vike modules that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  if (debug.isActivated) debug('assertIsNotProductionRuntime()', new Error().stack)
  env.shouldNotBeProduction = true
}

// Called by Vite hook configureServer()
function markEnvAsViteDev(): void | undefined {
  if (debug.isActivated) debug('markEnvAsViteDev()', new Error().stack)
  env.isViteDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsVitePreview(): void | undefined {
  if (debug.isActivated) debug('markEnvAsVitePreview()', new Error().stack)
  env.isVitePreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsVikePluginLoaded() {
  if (debug.isActivated) debug('markEnvAsVikePluginLoaded()', new Error().stack)
  env.isVikePluginLoaded = true
}
// Called by ../node/runtime/index.ts
function assertEnv(): void | undefined {
  if (debug.isActivated) debug('assertEnv()', new Error().stack)
  if (isVitest()) return
  const isProduction = !env.isViteDev && !env.isVitePreview
  if (isProduction) {
    // Seems to be the only reliable way to assert that the user doesn't load Vike's Vite plugin in production. (The other assert() that uses process.env.NODE_ENV doesn't work if the user sets the process.env.NODE_ENV value later.)
    assertUsage(!env.isVikePluginLoaded, vikeVitePluginLoadedInProductionError)
    // This assert() is the main goal of this file: it ensures assertIsNotProductionRuntime()
    assert(!env.shouldNotBeProduction)
  } else {
    // This assert() is obious and boring
    assert(env.shouldNotBeProduction)
    assert(env.isVikePluginLoaded)
  }
}
