// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProductionRuntime }
export { markEnvAsViteDev }
export { markEnvAsVitePreview }
export { markEnvAsVikePluginLoaded }
export { assertEnv }

import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { createDebugger } from './debug.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isVitest } from './isVitest.js'
assertIsNotBrowser()
const debug = createDebugger('vike:setup')

const env = getGlobalObject<{
  shouldNotBeProduction?: true
  isViteDev?: true
  isVitePreview?: true
  isVikePluginLoaded?: true
}>('utils/assertIsNotProductionRuntime.ts', {})

// Called by Vike modules that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  if (debug.isEnabled) debug('assertIsNotProductionRuntime()', new Error().stack)
  env.shouldNotBeProduction = true
}

// Called by Vite hook configureServer()
function markEnvAsViteDev(): void | undefined {
  if (debug.isEnabled) debug('markEnvAsViteDev()', new Error().stack)
  env.isViteDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsVitePreview(): void | undefined {
  if (debug.isEnabled) debug('markEnvAsVitePreview()', new Error().stack)
  env.isVitePreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsVikePluginLoaded() {
  if (debug.isEnabled) debug('markEnvAsVikePluginLoaded()', new Error().stack)
  env.isVikePluginLoaded = true
}
// Called by ../node/runtime/index.ts
function assertEnv(): void | undefined {
  if (debug.isEnabled) debug('assertEnv()', new Error().stack)
  if (isVitest()) return
  const isProduction = !env.isViteDev && !env.isVitePreview
  if (isProduction) {
    assertUsage(
      !env.isVikePluginLoaded,
      `Vike's Vite plugin (the vike/plugin module) is being loaded in production which is forbidden`
    )
    assert(!env.shouldNotBeProduction)
  } else {
    // This assert() is boring/obvious
    assert(env.shouldNotBeProduction)
    assert(env.isVikePluginLoaded)
  }
}
