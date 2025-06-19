export { execHook }
export { execHookSingle }
export { execHookSingleWithReturn }
export { execHookDirectly }
export { execHookWithoutPageContext }
export { execHookGlobal }
export { execHookSync }
export { getPageContext }
export { providePageContext }
export { isUserHookError }
export type { PageContextExecuteHook }

import { getProjectError, assertWarning, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import type { Hook, HookLoc } from './getHook.js'
import type { VikeConfigPublicPageLazy } from '../getPageFiles.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../../types/Config.js'
import type { PageConfigGlobalRuntime } from '../../types/PageConfig.js'
import type { PageContextForPublicUsageServer } from '../../node/runtime/renderPage/preparePageContextForPublicUsageServer.js'
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

type PageContextExecuteHook = VikeConfigPublicPageLazy & PageContextForPublicUsage
type PageContextForPublicUsage = PageContextForPublicUsageServer | PageContextForPublicUsageClientShared

type HookWithResult = Hook & {
  hookReturn: unknown
}

async function execHookSingle<PageContext extends PageContextExecuteHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirectly([hook], pageContext, preparePageContextForPublicUsage)
  const { hookReturn } = hooksWithResult[0]!
  assertUsage(
    hookReturn === undefined,
    `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`,
  )
}

async function execHookSingleWithReturn<PageContext extends PageContextExecuteHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirectly([hook], pageContext, preparePageContextForPublicUsage)
  const { hookReturn } = hooksWithResult[0]!
  return { hookReturn }
}

async function execHook<PageContext extends PageContextExecuteHook>(
  hookName: HookName,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const hooks = getHookFromPageContextNew(hookName, pageContext)
  return await execHookDirectly(hooks, pageContext, preparePageContextForPublicUsage)
}

async function execHookDirectly<PageContext extends PageContextPrepareMinimum>(
  hooks: Hook[],
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  if (!hooks.length) return [] as HookWithResult[]
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  const hooksWithResult = await Promise.all(
    hooks.map(async (hook) => {
      const hookReturn = await execHookAsync(
        () => hook.hookFn(pageContextForPublicUsage),
        hook,
        pageContextForPublicUsage,
      )
      return { ...hook, hookReturn }
    }),
  )
  return hooksWithResult
}

async function execHookGlobal<HookArg extends PageContextPrepareMinimum | GlobalContextPrepareMinimum>(
  hookName: HookNameGlobal,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageContext: PageContextPrepareMinimum | null,
  hookArg: HookArg,
  prepareForPublicUsage: (hookArg: HookArg) => HookArg,
) {
  const hooks = getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName)
  const hookArgForPublicUsage = prepareForPublicUsage(hookArg)
  await Promise.all(
    hooks.map(async (hook) => {
      await execHookAsync(() => hook.hookFn(hookArgForPublicUsage), hook, pageContext)
    }),
  )
}

function isUserHookError(err: unknown): false | HookLoc {
  if (!isObject(err)) return false
  return globalObject.userHookErrors.get(err) ?? false
}

async function execHookWithoutPageContext<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
): Promise<HookReturn> {
  const { hookName, hookFilePath, hookTimeout } = hook
  const hookReturn = await execHookAsync(hookFnCaller, { hookName, hookFilePath, hookTimeout }, null)
  return hookReturn
}
function execHookAsync<HookReturn>(
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

function execHookSync<PageContext extends PageContextPrepareMinimum>(
  hook: Omit<Hook, 'hookTimeout'>,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
) {
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  providePageContextInternal(pageContextForPublicUsage)
  const hookReturn = hook.hookFn(pageContextForPublicUsage)
  return { hookReturn }
}

function isNotDisabled(timeout: false | number): timeout is number {
  return !!timeout && timeout !== Infinity
}

/**
 * Access `pageContext` object inside Vike hooks, in order to create universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function getPageContext<PageContext = PageContextClient | PageContextServer>(): null | PageContext {
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
