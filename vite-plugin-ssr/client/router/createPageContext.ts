export { createPageContext }

import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { getPageFilesAll } from '../../shared/getPageFiles'
import { getBaseUrl } from '../getBaseUrl'
import { assertBaseUrl, PromiseType, objectAssign, getGlobalObject } from './utils'
const globalObject = getGlobalObject<{
  pageFilesData?: PromiseType<ReturnType<typeof getPageFilesAll>>
}>('createPageContext.ts', {})

async function createPageContext<T extends { urlOriginal: string }>(pageContextBase?: T) {
  if (!globalObject.pageFilesData) {
    globalObject.pageFilesData = await getPageFilesAll(true)
  }
  const { pageFilesAll, allPageIds } = globalObject.pageFilesData
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const pageContext = {
    _objectCreatedByVitePluginSsr: true,
    _urlHandler: null,
    _baseUrl: baseUrl,
    _isProduction: import.meta.env.PROD,
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds
  }
  objectAssign(pageContext, pageContextBase)
  addComputedUrlProps(pageContext)
  return pageContext
}
