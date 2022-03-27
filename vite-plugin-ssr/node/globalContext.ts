export { getGlobalContext }
export type { GlobalContext }

import { objectAssign, PromiseType, assertBaseUrl, handlePageContextRequestSuffix, parseUrl, assert } from './utils'
import { getPageFilesAllServerSide } from '../shared/getPageFiles'
import { getSsrEnv } from './ssrEnv'

type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

async function getGlobalContext() {
  const ssrEnv = getSsrEnv()
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const globalContext = {
    _parseUrl,
    _baseUrl: baseUrl,
    _objectCreatedByVitePluginSsr: true,
  }

  objectAssign(globalContext, {
    _isProduction: ssrEnv.isProduction,
    _viteDevServer: ssrEnv.viteDevServer,
    _root: ssrEnv.root,
    _baseAssets: ssrEnv.baseAssets,
    _outDir: ssrEnv.baseAssets,
  })

  const { pageFilesAll, allPageIds } = await getPageFilesAllServerSide(ssrEnv.isProduction)
  objectAssign(globalContext, {
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds,
  })

  return globalContext
}

function getBaseUrl(): string {
  const { baseUrl } = getSsrEnv()
  return baseUrl
}

function _parseUrl(url: string, baseUrl: string): ReturnType<typeof parseUrl> & { isPageContextRequest: boolean } {
  assert(url.startsWith('/') || url.startsWith('http'))
  assert(baseUrl.startsWith('/'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestSuffix(url)
  return { ...parseUrl(urlWithoutPageContextRequestSuffix, baseUrl), isPageContextRequest }
}
