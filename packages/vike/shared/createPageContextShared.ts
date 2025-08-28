export { createPageContextShared }
export { createPageContextObject }

import type { VikeConfigPublic } from './page-configs/resolveGlobalConfigPublic.js'
import { type PageContextPrepareMinimum } from './preparePageContextForPublicUsage.js'
import { changeEnumerable, objectAssign } from './utils.js'

function createPageContextShared<T extends PageContextPrepareMinimum>(
  pageContextCreated: T,
  vikeConfigPublic: VikeConfigPublic,
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
