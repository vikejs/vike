export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { createGetGlobalContext } from '../shared/createGetGlobalContext.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'

type GlobalContextClientSidePublic = {
  // Nothing public for now
}
type GlobalContextClientSide = Awaited<ReturnType<typeof getGlobalContext>>

const getGlobalContext = createGetGlobalContext(virtualFileExports, true, async (globalContext) => {
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
})
