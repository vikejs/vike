export { getGlobalContext }

import { getPageFilesAll } from '../../shared/getPageFiles'
import { assertBaseUrl, PromiseType, getBaseUrl, objectAssign, getGlobalObject } from './utils'
const globalObject = getGlobalObject<{
  globalContext?: PromiseType<ReturnType<typeof retrieveGlobalContext>>
}>('getGlobalContext.ts', {})

async function getGlobalContext() {
  if (!globalObject.globalContext) {
    globalObject.globalContext = await retrieveGlobalContext()
  }
  return globalObject.globalContext
}

async function retrieveGlobalContext() {
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const globalContext = {
    _urlProcessor: null,
    _baseUrl: baseUrl,
    _objectCreatedByVitePluginSsr: true,
    // @ts-ignore
    _isProduction: import.meta.env.PROD as boolean
  }
  const { pageFilesAll, allPageIds } = await getPageFilesAll(true)
  objectAssign(globalContext, {
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds
  })
  return globalContext
}
