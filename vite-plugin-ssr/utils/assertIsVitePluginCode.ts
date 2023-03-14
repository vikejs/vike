export { assertIsVitePluginCode }
export { markEnvAsDev }
export { markEnvAsPreview }
export { assertServerEnv }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isVitest } from './isVitest'

const state = getGlobalObject<{
  isNotProduction?: true
  isDev?: true
  isVitePreview?: true
}>('utils/assertIsVitePluginCode.ts', {})

function assertServerEnv(): void | undefined {
  if (isVitest()) return
  if (state.isNotProduction) {
    assert(state.isDev || state.isVitePreview)
  }
}

function assertIsVitePluginCode(): void | undefined {
  state.isNotProduction = true
}
function markEnvAsDev(): void | undefined {
  state.isDev = true
}
function markEnvAsPreview(): void | undefined {
  state.isVitePreview = true
}
