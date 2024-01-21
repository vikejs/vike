// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProductionRuntime }
export { markEnvAsDev }
export { markEnvAsPreview }
export { markEnvAsVite }
export { assertEnv }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { createDebugger } from './debug.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isVitest } from './isVitest.js'
assertIsNotBrowser()
const debug = createDebugger('vike:setup')

const env = getGlobalObject<{
  shouldBeVite?: true
  isDev?: true
  isPreview?: true
  isVite?: true
}>('utils/assertIsNotProductionRuntime.ts', {})

// Called by Vike modules that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  if (debug.isEnabled) debug('assertIsNotProductionRuntime()', new Error().stack)
  env.shouldBeVite = true
}

// Called by Vite hook configureServer()
function markEnvAsDev(): void | undefined {
  if (debug.isEnabled) debug('markEnvAsDev()', new Error().stack)
  env.isDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsPreview(): void | undefined {
  if (debug.isEnabled) debug('markEnvAsPreview()', new Error().stack)
  env.isPreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsVite() {
  if (debug.isEnabled) debug('markEnvAsVite()', new Error().stack)
  env.isVite = true
}
// Called by ../node/runtime/index.ts
function assertEnv(): void | undefined {
  if (debug.isEnabled) debug('assertEnv()', new Error().stack)
  if (isVitest()) return
  if (env.isDev || env.isPreview) {
    assert(env.isVite)
    assert(env.shouldBeVite)
  } else {
    assert(!env.isVite)
    assert(!env.shouldBeVite)
  }
}
