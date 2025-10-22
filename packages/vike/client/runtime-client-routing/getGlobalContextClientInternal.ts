export { getGlobalContextClientInternal }
export type { GlobalContextClientInternal }

import { getGlobalContextClientInternalShared } from '../shared/getGlobalContextClientInternalShared.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import type { GlobalContextBase } from '../../shared/createGlobalContextShared.js'
import { objectAssign } from './utils.js'

type GlobalContextClientInternal = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

async function getGlobalContextClientInternal() {
  const globalContext = await getGlobalContextClientInternalShared()
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
