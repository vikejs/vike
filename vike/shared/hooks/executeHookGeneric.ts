export { executeHookGeneric } // TO-DO/refactor: start using executeHookGeneric() and, eventually, prominently use it
export { executeHookGenericGlobalCumulative }

import type { PageConfigUserFriendlyOld } from '../getPageFiles.js'
import { executeHook } from './executeHook.js'
import { getHookFromPageContext, type HookName, getHookFromPageConfigGlobalCumulative } from './getHook.js'
import type { HookNameGlobal } from '../page-configs/Config.js'
import type { PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'

async function executeHookGeneric(hookName: HookName, pageContext: PageConfigUserFriendlyOld) {
  const hook = getHookFromPageContext(pageContext, hookName)
  if (!hook) return
  await executeHook(() => hook.hookFn(pageContext), hook, pageContext)
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
