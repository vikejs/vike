export { getErrorPageId }
export { isErrorPageId }
export { isErrorPage }

// TODO/v1-release: consider loading this file only for Client Routing

import { assert, assertUsage, unique } from './utils'
import type { PlusConfig } from './page-configs/PlusConfig'
import type { PageFile } from './getPageFiles'

function getErrorPageId(pageFilesAll: PageFile[], plusConfigs: PlusConfig[]): string | null {
  if (plusConfigs.length > 0) {
    const errorPlusConfigs = plusConfigs.filter((p) => p.isErrorPage)
    if (errorPlusConfigs.length === 0) return null
    assertUsage(errorPlusConfigs.length === 1, 'Only one error page can be defined')
    return errorPlusConfigs[0]!.pageId
  }
  // TODO/v1-release: remove
  const errorPageIds = unique(pageFilesAll.map(({ pageId }) => pageId).filter((pageId) => isErrorPageId(pageId, false)))
  assertUsage(
    errorPageIds.length <= 1,
    `Only one _error.page.js is allowed, but found several: ${errorPageIds.join(' ')}`
  )
  if (errorPageIds.length > 0) {
    const errorPageId = errorPageIds[0]
    assert(errorPageId)
    return errorPageId
  }
  return null
}

// TODO/v1-release: remove
function isErrorPageId(pageId: string, _isV1Design: false): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_error')
}

function isErrorPage(pageId: string, plusConfigs: PlusConfig[]): boolean {
  if (plusConfigs.length > 0) {
    const plusConfig = plusConfigs.find((p) => p.pageId === pageId)
    assert(plusConfig)
    return plusConfig.isErrorPage
  } else {
    return isErrorPageId(pageId, false)
  }
}
