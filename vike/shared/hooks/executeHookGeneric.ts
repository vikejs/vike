export { executeHookGeneric }
export { executeHookGenericGlobalCumulative }

import type { PageConfigUserFriendlyOld } from '../getPageFiles.js'
import { executeHook } from './executeHook.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../page-configs/Config.js'
import type { PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'

// TO-DO/eventually: use executeHookGeneric() more prominently
async function executeHookGeneric<PageContext extends PageConfigUserFriendlyOld>(
  hookName: HookName,
  pageContext: PageContext,
  prepare: (pageContext: PageContext) => PageContext
) {
  const hooks = getHookFromPageContextNew(hookName, pageContext)
  if (!hooks.length) return []
  const pageContextPrepared = prepare(pageContext)
  const hooksWithResult = await Promise.all(
    hooks.map(async (hook) => {
      const hookResult = await executeHook(() => hook.hookFn(pageContextPrepared), hook, pageContext)
      return { ...hook, hookResult }
    })
  )
  return hooksWithResult
}

async function executeHookGenericGlobalCumulative(
  hookName: HookNameGlobal,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageContext: object | null,
  arg: object
) {
  const hooks = getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName)
  await Promise.all(
    hooks.map(async (hook) => {
      await executeHook(() => hook.hookFn(arg), hook, pageContext)
    })
  )
}
