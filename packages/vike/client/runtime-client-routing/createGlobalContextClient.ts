export { createGlobalContextClient }
export type { GlobalContextClient }
export type { GlobalContextClientInternal }

import { createGlobalContextClientShared } from '../shared/createGlobalContextClientShared.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import type { GlobalContextBase, GlobalContextBasePublic } from '../../shared/createGlobalContextShared.js'
import { objectAssign } from './utils.js'

// Public type
type GlobalContextClient = GlobalContextBasePublic &
  Pick<GlobalContextClientInternal, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternal = Awaited<ReturnType<typeof createGlobalContextClient>>

async function createGlobalContextClient() {
  const globalContext = await createGlobalContextClientShared()
  objectAssign(globalContext, await addGlobalContext(globalContext))
  return globalContext
}

// TO-DO/next-major-release make this function sync
async function addGlobalContext(globalContext: GlobalContextBase) {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    globalContext._pageFilesAll,
    globalContext._pageConfigs,
    globalContext._pageConfigGlobal,
    globalContext._allPageIds,
  )
  return {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
  }
}
