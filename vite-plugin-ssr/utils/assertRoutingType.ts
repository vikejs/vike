export { assertClientRouting }
export { assertServerRouting }

import { assertUsage } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'

const state = getGlobalObject<{ isClientRouting?: boolean }>('utils/assertRouterType.ts', {})

// If an assertion fails because of a wrong usage, then we assume that the user is trying to import from 'vite-plugin-ssr/client/router' while not setting `clientRouting` to `true`. Note that 'vite-plugin-ssr/client' only exports the type `PageContextBuiltInClient` and that the package.json#exports entry 'vite-plugin-ssr/client' will eventually be removed.
const usageError = "`import { something } from 'vite-plugin-ssr/client/router'` is forbidden" as const
const err1 = `${usageError} on the server-side` as const
const err2 = `${usageError} when using Server Routing` as const

function assertClientRouting() {
  assertUsage(isBrowser(), err1)
  assertUsage(state.isClientRouting !== false, err2)
  state.isClientRouting = true
}

function assertServerRouting() {
  assertUsage(isBrowser(), err1)
  assertUsage(state.isClientRouting !== true, err2)
  state.isClientRouting = false
}
