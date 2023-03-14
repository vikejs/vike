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

function assertServerEnv(): void | undefined {
  if (isVitest()) return
  if (state.shouldBePlugin) {
    assert(state.isPlugin)
    assert(state.isDev || state.isPreview)
  }
}

function assertIsVitePluginCode(): void | undefined {
  assert(state.isPlugin)
  state.shouldBePlugin = true
}
function markEnvAsDev(): void | undefined {
  assert(state.isPlugin)
  state.isDev = true
}
function markEnvAsPreview(): void | undefined {
  assert(state.isPlugin)
  state.isPreview = true
}
function markEnvAsPlugin() {
  state.isPlugin = true
}
