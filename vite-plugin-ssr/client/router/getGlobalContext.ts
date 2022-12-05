export { getGlobalContext }

import { getPageFilesAll } from '../../shared/getPageFiles'
import { getBaseUrl } from '../getBaseUrl'
import { assertBaseUrl, PromiseType, objectAssign, getGlobalObject } from './utils'
const globalObject = getGlobalObject<{
  globalContext?: PromiseType<ReturnType<typeof retrieveGlobalContext>>
}>('getGlobalContext.ts', {})

async function getGlobalContext() {
  if (!globalObject.globalContext) {
    globalObject.globalContext = await retrieveGlobalContext()
  }
  return globalObject.globalContext
}

// TODO: refactor
async function retrieveGlobalContext() {
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const globalContext = {
    _urlProcessor: null,
    _baseUrl: baseUrl,
    _objectCreatedByVitePluginSsr: true,
    _isProduction: import.meta.env.PROD
  }
  const { pageFilesAll, allPageIds } = await getPageFilesAll(true)
  objectAssign(globalContext, {
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds
  })
  return globalContext
}
