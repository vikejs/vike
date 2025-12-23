// TODO: rename all exports

export { execHook }
export { execHookGlobal }
export { execHookDirect }
export { execHookDirectSingle }
export { execHookDirectSingleWithReturn }
export { execHookDirectWithoutPageContext }
export { execHookDirectSync }
export { execHookVanilla }
export { execHookVanillaSync }
export { getPageContext_sync }
export { providePageContext }
export { isUserHookError }
export type { PageContextExecHook }

import { getProjectError, assertWarning, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import type { Hook, HookLoc } from './getHook.js'
import type { PageContextConfig } from '../getPageFiles.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../../types/Config.js'
import { assert } from '../utils.js'
import type { PageContextForPublicUsageServer } from '../../server/runtime/renderPageServer/preparePageContextForPublicUsageServer.js'
import type { PageContextForPublicUsageClientShared } from '../../client/shared/preparePageContextForPublicUsageClientShared.js'
import {
  type PageContextPrepareMinimum,
  preparePageContextForPublicUsage,
} from '../preparePageContextForPublicUsage.js'
import type { GlobalContextPrepareMinimum } from '../prepareGlobalContextForPublicUsage.js'
const globalObject = getGlobalObject('utils/execHook.ts', {
  userHookErrors: new WeakMap<object, HookLoc>(),
  pageContext: null as null | PageContextPrepareMinimum,
})

type PageContextExecHook = PageContextConfig & PageContextForPublicUsage
type PageContextForPublicUsage = PageContextForPublicUsageServer | PageContextForPublicUsageClientShared

type HookWithResult = Hook & {
  hookReturn: unknown
}

async function execHook<PageContext extends PageContextExecHook>(
  hookName: HookName,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooks = getHookFromPageContextNew(hookName, pageContext)
  return await execHookDirect(hooks, pageContext, preparePageContextForPublicUsage)
}

async function execHookGlobal<HookArg extends GlobalContextPrepareMinimum>(
  hookName: HookNameGlobal,
  globalContext: GlobalContextPrepareMinimum,
  pageContext: PageContextPrepareMinimum | null,
  hookArg: HookArg,
  prepareForPublicUsage: (hookArg: HookArg) => HookArg,
) {
  const hooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, hookName)
  const hookArgForPublicUsage = prepareForPublicUsage(hookArg)
  await Promise.all(
    hooks.map(async (hook) => {
      await execHookDirectAsync(() => hook.hookFn(hookArgForPublicUsage), hook, pageContext, globalContext)
    }),
  )
}

async function execHookDirect<PageContext extends PageContextPrepareMinimum>(
  hooks: Hook[],
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  if (!hooks.length) return [] as HookWithResult[]
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  const hooksWithResult = await Promise.all(
    hooks.map(async (hook) => {
      const hookReturn = await execHookDirectAsync(
        () => hook.hookFn(pageContextForPublicUsage),
        hook,
        pageContextForPublicUsage,
        pageContext._globalContext,
      )
      return { ...hook, hookReturn }
    }),
  )
  return hooksWithResult
}

async function execHookDirectSingle<PageContext extends PageContextExecHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirect([hook], pageContext, preparePageContextForPublicUsage)
  const { hookReturn } = hooksWithResult[0]!
  assertUsage(
    hookReturn === undefined,
    `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`,
  )
}

async function execHookDirectSingleWithReturn<PageContext extends PageContextExecHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirect([hook], pageContext, preparePageContextForPublicUsage)
  const { hookReturn } = hooksWithResult[0]!
  return { hookReturn }
}

function isUserHookError(err: unknown): false | HookLoc {
  if (!isObject(err)) return false
  return globalObject.userHookErrors.get(err) ?? false
}

async function execHookDirectWithoutPageContext<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  globalContext: GlobalContextPrepareMinimum,
): Promise<HookReturn> {
  const { hookName, hookFilePath, hookTimeout } = hook
  const hookReturn = await execHookDirectAsync(
    hookFnCaller,
    { hookName, hookFilePath, hookTimeout },
    null,
    globalContext,
  )
  return hookReturn
}
function execHookDirectAsync<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  pageContextForPublicUsage: null | PageContextPrepareMinimum,
  globalContext: GlobalContextPrepareMinimum,
): Promise<HookReturn> {
  const {
    hookName,
    hookFilePath,
    hookTimeout: { error: timeoutErr, warning: timeoutWarn },
  } = hook

  let resolve!: (ret: HookReturn) => void
  let reject!: (err: unknown) => void
  const promise = new Promise<HookReturn>((resolve_, reject_) => {
    resolve = (ret) => {
      clearTimeouts()
      resolve_(ret)
    }
    reject = (err) => {
      clearTimeouts()
      reject_(err)
    }
  })

  const clearTimeouts = () => {
    if (currentTimeoutWarn) clearTimeout(currentTimeoutWarn)
    if (currentTimeoutErr) clearTimeout(currentTimeoutErr)
  }
  const currentTimeoutWarn =
    isNotDisabled(timeoutWarn) &&
    setTimeout(() => {
      assertWarning(
        false,
        `The ${hookName}() hook defined by ${hookFilePath} is slow: it's taking more than ${humanizeTime(
          timeoutWarn,
        )} (https://vike.dev/hooksTimeout)`,
        { onlyOnce: false },
      )
    }, timeoutWarn)
  const currentTimeoutErr =
    isNotDisabled(timeoutErr) &&
    setTimeout(() => {
      const err = getProjectError(
        `The ${hookName}() hook defined by ${hookFilePath} timed out: it didn't finish after ${humanizeTime(
          timeoutErr,
        )} (https://vike.dev/hooksTimeout)`,
      )
      reject(err)
    }, timeoutErr)
  ;(async () => {
    try {
      providePageContextInternal(pageContextForPublicUsage)
      const ret = await execHookVanilla(hookFnCaller, hook, globalContext, pageContextForPublicUsage)
      resolve(ret)
    } catch (err) {
      if (isObject(err)) {
        globalObject.userHookErrors.set(err, { hookName, hookFilePath })
      }
      reject(err)
    }
  })()

  return promise
}

function execHookDirectSync<PageContext extends PageContextPrepareMinimum>(
  hook: Omit<Hook, 'hookTimeout'>,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  providePageContextInternal(pageContextForPublicUsage)
  const hookReturn = execHookVanillaSync(
    () => hook.hookFn(pageContextForPublicUsage),
    hook,
    pageContext._globalContext,
    pageContextForPublicUsage,
  )
  return { hookReturn }
}

function execHookVanillaSync<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookTimeout' | 'hookFn'>,
  globalContext: GlobalContextPrepareMinimum,
  pageContext: PageContextPrepareMinimum | null = null,
): Promise<HookReturn> | HookReturn {
  return execHookWithOnHookCall(hookFnCaller, hook, globalContext, pageContext, true)
}

function execHookVanilla<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookTimeout' | 'hookFn'>,
  globalContext: GlobalContextPrepareMinimum,
  pageContext: PageContextPrepareMinimum | null = null,
): Promise<HookReturn> | HookReturn {
  return execHookWithOnHookCall(hookFnCaller, hook, globalContext, pageContext, false)
}

function execHookWithOnHookCall<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookTimeout' | 'hookFn'>,
  globalContext: GlobalContextPrepareMinimum,
  pageContext: PageContextPrepareMinimum | null,
  sync = false,
): HookReturn | Promise<HookReturn> {
  const { hookName, hookFilePath } = hook
  assert(hookName !== 'onHookCall') // ensure no infinite loop
  const configValue = globalContext._pageConfigGlobal.configValues['onHookCall']
  if (!configValue?.value) return hookFnCaller()

  const context: { pageContext?: unknown; globalContext?: unknown } = { globalContext }
  if (pageContext) context.pageContext = pageContext

  let originalCalled = false
  let originalReturn: HookReturn
  let call: () => HookReturn | Promise<HookReturn> = () => {
    originalCalled = true
    originalReturn = hookFnCaller()
    return originalReturn
  }
  for (const wrapper of configValue.value as Function[]) {
    const hookPublic = { name: hookName, filePath: hookFilePath, sync, call }
    call = async () => {
      await wrapper(hookPublic, context)
      // For sync hooks this asserts the hook.call() has been called synchronously
      // For async hooks, this asserts the hook.call() has been called before the wrapper's Promise resolves
      // (prevents setTimeout(() => hook.call()) for example)
      assertUsage(originalCalled, 'onHookCall() must run hook.call()')
      return originalReturn
    }
  }
  return call()
}

function isNotDisabled(timeout: false | number): timeout is number {
  return !!timeout && timeout !== Infinity
}

function getPageContext_sync<PageContext = PageContextClient | PageContextServer>(): null | PageContext {
  const { pageContext } = globalObject
  if (!pageContext) return null
  const pageContextForPublicUsage = (pageContext as Record<string, unknown>)._isProxyObject
    ? // providePageContext() is called on the user-land (e.g. it's called by `vike-{react,vue,solid}`) thus it's already a proxy
      pageContext
    : preparePageContextForPublicUsage(pageContext)
  return pageContextForPublicUsage as any
}
/**
 * Provide `pageContext` for universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function providePageContext(pageContext: null | PageContextClient | PageContextServer) {
  providePageContextInternal(pageContext as any)
}
function providePageContextInternal(pageContext: null | PageContextPrepareMinimum) {
  globalObject.pageContext = pageContext
  // Promise.resolve() is quicker than process.nextTick() and setImmediate()
  // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
  Promise.resolve().then(() => {
    globalObject.pageContext = null
  })
}
