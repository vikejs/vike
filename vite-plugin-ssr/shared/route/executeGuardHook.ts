export { executeGuardHook }

import { getHook, Hook } from '../getHook'
import { assert, assertUsage, executeHook } from './utils'
import type { PageContextExports, PageFile } from '../getPageFiles'
import type { PageConfig } from '../page-configs/PageConfig'
import { findPageGuard } from './loadPageRoutes'

async function executeGuardHook<
  T extends PageContextExports & {
    _pageId: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  }
>(pageContext: T, prepareForUserConsumption: (pageConfig: T) => T | void): Promise<void> {
  let hook: Hook | null
  if (pageContext._pageFilesAll.length > 0) {
    // V0.4 design
    assert(pageContext._pageConfigs.length === 0)
    hook = findPageGuard(pageContext._pageId, pageContext._pageFilesAll)
  } else {
    // V1 design
    hook = getHook(pageContext, 'guard')
  }

  if (!hook) return
  const guard = hook.hookFn

  let pageContextForUserConsumption = pageContext
  const res = prepareForUserConsumption(pageContext)
  if (res) pageContextForUserConsumption = res

  const hookResult = await executeHook(() => guard(pageContextForUserConsumption), 'guard', hook.hookFilePath)
  assertUsage(
    hookResult === undefined,
    `The guard() hook of ${hook.hookFilePath} returns a value, but guard() doesn't accept any return value`
  )
}
