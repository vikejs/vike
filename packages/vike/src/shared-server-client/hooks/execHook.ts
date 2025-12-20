export { execHook }
export { execHookGlobal }
export { execHookDirect }
export { execHookDirectSingle }
export { execHookDirectSingleWithReturn }
export { execHookDirectWithoutPageContext }
export { execHookDirectSync }
export { execHookWithOnHookCall }
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
import type { HookName, HookNameGlobal, OnHookCall } from '../../types/Config.js'
import type { PageConfigGlobalRuntime } from '../../types/PageConfig.js'
import { isArray } from '../utils.js'
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
      await execHookDirectAsync(
        () => execHookWithOnHookCall(hook, globalContext, hookArgForPublicUsage),
        hook,
        pageContext,
      )
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
        () => execHookWithOnHookCall(hook, pageContext._globalContext, pageContextForPublicUsage),
        hook,
        pageContextForPublicUsage,
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
): Promise<HookReturn> {
  const { hookName, hookFilePath, hookTimeout } = hook
  const hookReturn = await execHookDirectAsync(hookFnCaller, { hookName, hookFilePath, hookTimeout }, null)
  return hookReturn
}
function execHookDirectAsync<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  pageContextForPublicUsage: null | PageContextPrepareMinimum,
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
      const ret = await hookFnCaller()
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
  const hookReturn = execHookWithOnHookCall(hook, pageContext._globalContext, pageContextForPublicUsage)
  return { hookReturn }
}

function execHookWithOnHookCall<HookReturn>(
  hook: HookLoc & { hookFn: Function },
  globalContext: GlobalContextPrepareMinimum,
  ...args: unknown[]
): HookReturn {
  const { hookFn, hookName, hookFilePath } = hook
  // Don't wrap onHookCall itself to prevent infinite recursion
  if (hookName === 'onHookCall') return hookFn(...args)
  const configValue = globalContext._pageConfigGlobal.configValues['onHookCall']
  if (!configValue?.value) return hookFn(...args)
  const wrappers = configValue.value
  if (!isArray(wrappers)) return hookFn(...args)
  // First arg is pageContext for page hooks, globalContext for global hooks
  const context = args[0]
  let fn = () => hookFn(...args)
  for (const wrapper of wrappers as OnHookCall[]) {
    const prev = fn
    const hookPublic = { name: hookName, filePath: hookFilePath, call: prev }
    fn = () => wrapper(hookPublic, context)
  }
  return fn()
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
