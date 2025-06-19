export { execHookGuard }

import { getHookFromPageContext, getHookTimeoutDefault, type Hook } from '../hooks/getHook.js'
import { assert, assertUsage, isCallable } from './utils.js'
import type { PageFile } from '../getPageFiles.js'
import { execHookDirectSingle, type PageContextExecuteHook } from '../hooks/execHook.js'
import type { GlobalContextInternal } from '../createGlobalContextShared.js'
const errIntro = 'The guard() hook defined by'

async function execHookGuard<
  PageContext extends {
    pageId: string
  } & {
    _globalContext: GlobalContextInternal
  } & PageContextExecuteHook,
>(pageContext: PageContext, prepareForPublicUsage: (pageConfig: PageContext) => PageContext): Promise<void> {
  let hook: Hook | null
  if (pageContext._globalContext._pageFilesAll.length > 0) {
    // TODO/v1-release: remove
    // V0.4 design
    assert(pageContext._globalContext._pageConfigs.length === 0)
    hook = findPageGuard(pageContext.pageId, pageContext._globalContext._pageFilesAll)
  } else {
    // V1 design
    hook = getHookFromPageContext(pageContext, 'guard')
  }

  if (!hook) return

  await execHookDirectSingle(hook, pageContext, prepareForPublicUsage)
}

// We cannot easily use pageContext.exports for the V0.4 design
// TODO/v1-release: remove
type PageGuard = Hook
function findPageGuard(pageId: string, pageFilesAll: PageFile[]): null | PageGuard {
  const pageRouteFile = pageFilesAll.find((p) => p.pageId === pageId && p.fileType === '.page.route')
  if (!pageRouteFile) return null
  const { filePath, fileExports } = pageRouteFile
  assert(fileExports) // loadPageRoutes() should already have been called
  const hookFn = fileExports.guard
  if (!hookFn) return null
  const hookFilePath = filePath
  const hookTimeout = getHookTimeoutDefault('guard')

  assertUsage(isCallable(hookFn), `${errIntro} ${hookFilePath} should be a function`)
  return { hookFn, hookName: 'guard', hookFilePath, hookTimeout }
}
