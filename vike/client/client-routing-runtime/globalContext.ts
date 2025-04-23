export { getGlobalContext }
export type { GlobalContextClient }

import { createGetGlobalContextClient } from '../shared/createGetGlobalContextClient.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import type { GlobalContextShared, GlobalContextSharedPublic } from '../../shared/createGlobalContextShared.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'

// Public type
type GlobalContextClient = GlobalContextSharedPublic &
  Pick<GlobalContextClientInternal, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternal = Awaited<ReturnType<typeof getGlobalContext>>

const getGlobalContext = createGetGlobalContextClient(virtualFileExports, true, addGlobalContext)

async function addGlobalContext(globalContext: GlobalContextShared) {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    globalContext._pageFilesAll,
    globalContext._pageConfigs,
    globalContext._pageConfigGlobal,
    globalContext._allPageIds
  )
  return {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook
  }
}
