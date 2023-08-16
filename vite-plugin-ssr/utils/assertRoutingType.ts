export { assertClientRouting }
export { assertServerRouting }
export { checkIfClientRouting }

import { assertUsage, assertWarning } from './assert.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isBrowser } from './isBrowser.js'

const state = getGlobalObject<{ isClientRouting?: boolean }>('utils/assertRouterType.ts', {})

function assertClientRouting() {
  assertNoContradiction(checkIfClientRouting())
  state.isClientRouting = true
}

function checkIfClientRouting(): boolean {
  return state.isClientRouting !== false
}

function assertServerRouting() {
  assertNoContradiction(state.isClientRouting !== true)
  state.isClientRouting = false
}

function assertNoContradiction(noContradiction: boolean) {
  // If an assertion fails because of a wrong usage, then we assume that the user is trying to import from 'vite-plugin-ssr/client/router' while not setting `clientRouting` to `true`. Note that 'vite-plugin-ssr/client' only exports the type `PageContextBuiltInClient` and that the package.json#exports entry 'vite-plugin-ssr/client' will eventually be removed.
  assertUsage(
    isBrowser(),
    "`import { something } from 'vite-plugin-ssr/client/router'` is forbidden on the server-side",
    { showStackTrace: true }
  )
  assertWarning(
    noContradiction,
    "You shouldn't `import { something } from 'vite-plugin-ssr/client/router'` when using Server Routing. The 'vite-plugin-ssr/client/router' utilities work only with Client Routing. In particular, don't `import { navigate }` nor `import { prefetch }` as they unnecessarily bloat your client-side bundle.",
    { showStackTrace: true, onlyOnce: true }
  )
}
