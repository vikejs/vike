export { executeGuardHook }

import { getHook } from '../getHook'
import { assert, assertUsage, executeHook } from './utils'
import type { PageContextExports, PageFile } from '../getPageFiles'
import type { PageConfig } from '../page-configs/PageConfig'

async function executeGuardHook<T extends PageContextExports & PageData>(
  pageContext: T,
  prepareForUserConsumption: (pageConfig: T) => T | void
): Promise<void> {
  const hook = getHook(pageContext, 'guard')
  if (!hook) return
  const guard = hook.hookFn

  assertUsage(isV1design(pageContext), 'guard() only works with the V1 design')

  let pageContextForUserConsumption = pageContext
  const res = prepareForUserConsumption(pageContext)
  if (res) pageContextForUserConsumption = res

  const hookResult = await executeHook(() => guard(pageContextForUserConsumption), 'guard', hook.hookFilePath)
  assertUsage(
    hookResult === undefined,
    `The guard() hook of ${hook.hookFilePath} returns a value, but guard() doesn't accept any return value`
  )
}

type PageData = {
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
}
function isV1design(pageContext: PageData): boolean {
  const oldDesign = pageContext._pageFilesAll.length
  const newDesign = pageContext._pageConfigs.length
  assert(oldDesign === 0 || newDesign === 0)
  return oldDesign === 0
}
