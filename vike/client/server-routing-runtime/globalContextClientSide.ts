export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { getGlobalObject, objectReplace } from './utils.js'

// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'
const { pageFilesAll, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

type GlobalContextClientSidePublic = {
  // Nothing public for now
}
type GlobalContextClientSide = Awaited<ReturnType<typeof createGlobalContext>>

const globalObject = getGlobalObject<{
  globalContext?: GlobalContextClientSide
}>('server-routing-runtime/globalContextClientSide.ts', {})

async function getGlobalContext(): Promise<GlobalContextClientSide> {
  if (
    !globalObject.globalContext ||
    // Don't break HMR
    globalObject.globalContext._virtualFileExports !== virtualFileExports
  ) {
    const globalContextCreated = await createGlobalContext()
    if (!globalObject.globalContext) {
      globalObject.globalContext = globalContextCreated
    } else {
      // Ensure all `globalContext` references are preserved & updated
      objectReplace(globalObject.globalContext, globalContextCreated)
    }
  }
  return globalObject.globalContext
}

async function createGlobalContext() {
  const globalContext = {
    _virtualFileExports: virtualFileExports,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal
  }
  return globalContext
}
