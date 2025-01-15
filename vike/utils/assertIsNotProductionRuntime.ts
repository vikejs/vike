// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProductionRuntime }
export { assertEnv }
export { markSetup_viteDevServer }
export { markSetup_vitePreviewServer }
export { markSetup_vikeVitePlugin }
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
  viteDevServer?: true
  vitePreviewServer?: true
  vikeVitePlugin?: true
}>('utils/assertIsNotProductionRuntime.ts', {})

// Called by ../node/runtime/index.ts
function assertEnv(): void | undefined {
  if (debug.isActivated) debug('assertEnv()', new Error().stack)
  if (isVitest()) return
  if (!env.viteDevServer && !env.vitePreviewServer) {
    // Seems to be the only reliable way to assert that the user doesn't load Vike's Vite plugin in production. (The other assert() that uses process.env.NODE_ENV doesn't work if the user sets the process.env.NODE_ENV value later.)
    assertUsage(!env.vikeVitePlugin, vikeVitePluginLoadedInProductionError)
    // This assert() is the main goal of this file: it ensures assertIsNotProductionRuntime()
    assert(!env.shouldNotBeProduction)
  } else {
    // This two assert() aren't that interesting
    assert(env.shouldNotBeProduction)
    assert(env.vikeVitePlugin)
  }
}

// Called by Vike modules that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  if (debug.isActivated) debug('assertIsNotProductionRuntime()', new Error().stack)
  env.shouldNotBeProduction = true
}

// Called by Vite hook configureServer()
function markSetup_viteDevServer(): void | undefined {
  if (debug.isActivated) debug('markSetup_viteDevServer()', new Error().stack)
  env.viteDevServer = true
}
// Called by Vite hook configurePreviewServer()
function markSetup_vitePreviewServer(): void | undefined {
  if (debug.isActivated) debug('markSetup_vitePreviewServer()', new Error().stack)
  env.vitePreviewServer = true
}
// Called by ../node/plugin/index.ts
function markSetup_vikeVitePlugin() {
  if (debug.isActivated) debug('markSetup_vikeVitePlugin()', new Error().stack)
  env.vikeVitePlugin = true
}
