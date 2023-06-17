export { executeGuardHook }

import { getHook } from '../getHook'
import { assertUsage, executeHook } from './utils'
import type { PageContextExports } from '../getPageFiles'

async function executeGuardHook<T extends PageContextExports>(
  pageContext: T,
  prepareForUserConsumption: (pageConfig: T) => T | void
) {
  const hook = getHook(pageContext, 'guard')
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
