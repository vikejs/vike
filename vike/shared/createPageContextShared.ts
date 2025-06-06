export { createPageContextShared }
export { createPageContextObject }

import { execHookGlobal } from './hooks/execHook.js'
import type { VikeConfigPublicGlobal } from './page-configs/resolveVikeConfigPublic.js'
import type { PageConfigGlobalRuntime } from '../types/PageConfig.js'
import { type PageContextPrepareMinimum, preparePageContextForPublicUsage } from './preparePageContextForPublicUsage.js'
import { changeEnumerable, objectAssign } from './utils.js'

async function createPageContextShared<T extends PageContextPrepareMinimum>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime,
  vikeConfigPublicGlobal: VikeConfigPublicGlobal
) {
  objectAssign(pageContextCreated, vikeConfigPublicGlobal)

  await execHookGlobal(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated,
    preparePageContextForPublicUsage
  )

  return pageContextCreated
}

function createPageContextObject() {
  const pageContext = {
    _isOriginalObject: true as const,
    isPageContext: true as const
  }
  changeEnumerable(pageContext, '_isOriginalObject', false)
  return pageContext
}
