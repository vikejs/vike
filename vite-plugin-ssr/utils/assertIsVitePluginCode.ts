// Mechanism to ensure code isn't loaded by production runtime

export { assertIsVitePluginCode }
export { markEnvAsDev }
export { markEnvAsPreview }
export { markEnvAsPlugin }
export { assertServerEnv }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'
import { isVitest } from './isVitest'

assert(!isBrowser())

const state = getGlobalObject<{
  shouldBePlugin?: true
  isDev?: true
  isPreview?: true
  isPlugin?: true
}>('utils/assertIsVitePluginCode.ts', {})

// Called by *.ts that want to ensure that they aren't loaded by the production runtime
function assertIsVitePluginCode(): void | undefined {
  state.shouldBePlugin = true
}

// Called by Vite hook configureServer()
function markEnvAsDev(): void | undefined {
  state.isDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsPreview(): void | undefined {
  state.isPreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsPlugin() {
  state.isPlugin = true
}

// Called by ../node/runtime/index.ts
function assertServerEnv(): void | undefined {
  if (isVitest()) return
  if (!state.isDev && !state.isPreview) {
    // Ensure that no plugin code is loaded by production runtime
    assert(!state.isPlugin)
    assert(!state.shouldBePlugin)
  } else {
    assert(state.isPlugin)
    assert(state.shouldBePlugin)
  }
}
