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

function assertServerEnv() {
  if (state.isNotProduction) {
    assert(state.isDev || state.isVitePreview)
  }
}

function assertServerEnv_setIsNotProduction() {
  state.isNotProduction = true
}
function assertServerEnv_setIsDev() {
  state.isDev = true
}
function assertServerEnv_setIsVitePreview() {
  state.isVitePreview = true
}
