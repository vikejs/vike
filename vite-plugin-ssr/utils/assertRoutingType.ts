export { assertClientRouting }
export { assertServerRouting }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'

const state = getGlobalObject<{ isClientRouting?: boolean }>('utils/assertRouterType.ts', {})

function assertClientRouting() {
  assert(isBrowser())
  assert(state.isClientRouting !== false)
  state.isClientRouting = true
}

function assertServerRouting() {
  assert(isBrowser())
  assert(state.isClientRouting !== true)
  state.isClientRouting = false
}
