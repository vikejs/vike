export { assertIsVitePluginCode }
export { markEnvAsDev }
export { markEnvAsPreview }
export { markEnvAsPlugin }
export { assertServerEnv }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isVitest } from './isVitest'

const state = getGlobalObject<{
  shouldBePlugin?: true
  isDev?: true
  isPreview?: true
  isPlugin?: true
}>('utils/assertIsVitePluginCode.ts', {})

// Called by *.ts that want to ensure that they aren't included in the production runtime
function assertIsVitePluginCode(): void | undefined {
  state.shouldBePlugin = true
}

// Called by Vite hook configureServer()
function markEnvAsDev(): void | undefined {
  assert(state.isPlugin)
  state.isDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsPreview(): void | undefined {
  assert(state.isPlugin)
  state.isPreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsPlugin() {
  state.isPlugin = true
}

// Called by ../node/runtime/index.ts
function assertServerEnv(): void | undefined {
  if (isVitest()) return
  const isViteServer = state.isDev || state.isPreview
  if (state.isPlugin) {
    assert(isViteServer)
    assert(state.shouldBePlugin)
  } else {
    assert(!isViteServer)
    assert(!state.shouldBePlugin)
  }
}
