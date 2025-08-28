export { createPageContextShared }
export { createPageContextObject }

import type { GlobalConfigPublic } from './page-configs/resolveVikeConfigPublic.js'
import { type PageContextPrepareMinimum } from './preparePageContextForPublicUsage.js'
import { changeEnumerable, objectAssign } from './utils.js'

function createPageContextShared<T extends PageContextPrepareMinimum>(
  pageContextCreated: T,
  vikeConfigPublic: GlobalConfigPublic,
) {
  objectAssign(pageContextCreated, vikeConfigPublic)

  return pageContextCreated
}

function createPageContextObject() {
  const pageContext = {
    _isOriginalObject: true as const,
    isPageContext: true as const,
  }
  changeEnumerable(pageContext, '_isOriginalObject', false)
  return pageContext
}
