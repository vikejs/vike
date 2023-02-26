export { assertServerEnv }
export { assertServerEnv_setIsNotProduction }
export { assertServerEnv_setIsDev }
export { assertServerEnv_setIsVitePreview }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'

const state = getGlobalObject<{
  isNotProduction?: true
  isDev?: true
  isVitePreview?: true
}>('utils/assertServerEnv.ts', {})

function assertServerEnv(): void | undefined {
  if (isVitest()) return
  if (state.isNotProduction) {
    assert(state.isDev || state.isVitePreview)
  }
}

function assertServerEnv_setIsNotProduction(): void | undefined {
  state.isNotProduction = true
}
function assertServerEnv_setIsDev(): void | undefined {
  state.isDev = true
}
function assertServerEnv_setIsVitePreview(): void | undefined {
  state.isVitePreview = true
}

function isVitest(): boolean {
  return typeof process !== 'undefined' && typeof process.env !== 'undefined' && 'VITEST' in process.env
}
