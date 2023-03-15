export { assertClientRouting }
export { assertServerRouting }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'

assert(isBrowser())

const state = getGlobalObject<{ isClientRouting?: boolean }>('utils/assertRouterType.ts', {})

function assertClientRouting() {
  assert(state.isClientRouting !== false)
  state.isClientRouting = true
}

function assertServerRouting() {
  assert(state.isClientRouting !== true)
  state.isClientRouting = false
}
