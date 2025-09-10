export { getGlobalContextClientInternal }
export type { GlobalContextClient }
export type { GlobalContextClientInternal }

import { createGetGlobalContextClient } from '../shared/createGetGlobalContextClient.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import type { GlobalContextBase, GlobalContextBasePublic } from '../../shared/createGlobalContextShared.js'

// Public type
type GlobalContextClient = GlobalContextBasePublic &
  Pick<GlobalContextClientInternal, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternal = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

const getGlobalContextClientInternal = createGetGlobalContextClient(addGlobalContext)

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
