export { executeGuardHook }

import { getHook, getHookTimeoutDefault, type Hook } from '../hooks/getHook.js'
import { assert, assertUsage, isCallable } from './utils.js'
import type { PageConfigUserFriendlyOld, PageFile } from '../getPageFiles.js'
import type { PageConfigRuntime } from '../page-configs/PageConfig.js'
import { executeHook } from '../hooks/executeHook.js'
const errIntro = 'The guard() hook defined by'

async function executeGuardHook<
  T extends PageConfigUserFriendlyOld & {
    pageId: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
  }
>(pageContext: T, prepareForUserConsumption: (pageConfig: T) => T | void): Promise<void> {
  let hook: Hook | null
  if (pageContext._pageFilesAll.length > 0) {
    // V0.4 design
    assert(pageContext._pageConfigs.length === 0)
    hook = findPageGuard(pageContext.pageId, pageContext._pageFilesAll)
  } else {
    // V1 design
    hook = getHook(pageContext, 'guard')
  }

  if (!hook) return
  const guard = hook.hookFn

  let pageContextForUserConsumption = pageContext
  const res = prepareForUserConsumption(pageContext)
  if (res) pageContextForUserConsumption = res

  const hookResult = await executeHook(() => guard(pageContextForUserConsumption), hook, pageContext)
  assertUsage(
    hookResult === undefined,
    `${errIntro} ${hook.hookFilePath} returns a value, but guard() shouldn't return any value`
  )
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
