export { executeHook }
export { executeHookSingle }
export { executeHookSingleWithReturn }
export { executeHookWithErrorHandling }
export { executeHooksWithErrorHandling }
export { executeHookWithoutPageContext }
export { executeHookGlobalCumulative }
export { executeHookSync }
export { getPageContext }
export { providePageContext }
export { isUserHookError }
export type { PageContextExecuteHook }

import { getProjectError, assertWarning, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../types.js'
import type { Hook, HookLoc } from './getHook.js'
import type { PageConfigUserFriendlyOld } from '../getPageFiles.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../page-configs/Config.js'
import type { PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'
import type { PageContextForPublicUsageServer } from '../../node/runtime/renderPage/preparePageContextForPublicUsageServer.js'
import type { PageContextForPublicUsageClientShared } from '../../client/shared/preparePageContextForPublicUsageClientShared.js'
const globalObject = getGlobalObject('utils/executeHook.ts', {
  userHookErrors: new WeakMap<object, HookLoc>(),
  pageContext: null as PageContextUnknown
})

type PageContextExecuteHook = PageConfigUserFriendlyOld & PageContextForPublicUsage
type PageContextForPublicUsage = PageContextForPublicUsageServer | PageContextForPublicUsageClientShared

type HookWithResult = Hook & {
  hookReturn: unknown
}

async function executeHookSingle<PageContext extends PageContextExecuteHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  const res = await executeHooksWithErrorHandling([hook], pageContext, preparePageContextForPublicUsage)
  if ('err' in res) throw res.err
  const { hookReturn } = res.hooks[0]!
  assertUsage(
    hookReturn === undefined,
    `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`
  )
}

async function executeHookSingleWithReturn<PageContext extends PageContextExecuteHook>(
  hook: Hook,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  const res = await executeHooksWithErrorHandling([hook], pageContext, preparePageContextForPublicUsage)
  if ('err' in res) throw res.err
  const { hookReturn } = res.hooks[0]!
  return { hookReturn }
}

async function executeHook<PageContext extends PageContextExecuteHook>(
  hookName: HookName,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  const res = await executeHookWithErrorHandling(hookName, pageContext, preparePageContextForPublicUsage)
  if ('err' in res) throw res.err
  return res.hooks
}

async function executeHookWithErrorHandling<PageContext extends PageContextExecuteHook>(
  hookName: HookName,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  const hooks = getHookFromPageContextNew(hookName, pageContext)
  return executeHooksWithErrorHandling(hooks, pageContext, preparePageContextForPublicUsage)
}

async function executeHooksWithErrorHandling<PageContext extends Record<string, unknown>>(
  hooks: Hook[],
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  if (!hooks.length) return { hooks: [] as HookWithResult[] }
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  let hooksWithResult: HookWithResult[] | undefined
  let err: unknown
  try {
    hooksWithResult = await Promise.all(
      hooks.map(async (hook) => {
        const hookReturn = await executeHookAsync(
          () => hook.hookFn(pageContextForPublicUsage),
          hook,
          pageContextForPublicUsage
        )
        return { ...hook, hookReturn }
      })
    )
  } catch (err_) {
    err = err_
  }
  if (hooksWithResult) {
    return { hooks: hooksWithResult }
  } else {
    return { hooks, err }
  }
}

async function executeHookGlobalCumulative<HookArg extends Record<string, unknown>>(
  hookName: HookNameGlobal,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageContext: PageContextUnknown | null,
  hookArg: HookArg,
  prepareForPublicUsage: (hookArg: HookArg) => HookArg
) {
  const hooks = getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName)
  const hookArgForPublicUsage = prepareForPublicUsage(hookArg)
  await Promise.all(
    hooks.map(async (hook) => {
      await executeHookAsync(() => hook.hookFn(hookArgForPublicUsage), hook, pageContext)
    })
  )
}

type PageContextUnknown = null | Record<string, unknown>

function isUserHookError(err: unknown): false | HookLoc {
  if (!isObject(err)) return false
  return globalObject.userHookErrors.get(err) ?? false
}

async function executeHookWithoutPageContext<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>
): Promise<HookReturn> {
  const { hookName, hookFilePath, hookTimeout } = hook
  const hookReturn = await executeHookAsync(hookFnCaller, { hookName, hookFilePath, hookTimeout }, null)
  return hookReturn
}
function executeHookAsync<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  pageContextForPublicUsage: PageContextUnknown
): Promise<HookReturn> {
  const {
    hookName,
    hookFilePath,
    hookTimeout: { error: timeoutErr, warning: timeoutWarn }
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
          timeoutWarn
        )} (https://vike.dev/hooksTimeout)`,
        { onlyOnce: false }
      )
    }, timeoutWarn)
  const currentTimeoutErr =
    isNotDisabled(timeoutErr) &&
    setTimeout(() => {
      const err = getProjectError(
        `The ${hookName}() hook defined by ${hookFilePath} timed out: it didn't finish after ${humanizeTime(
          timeoutErr
        )} (https://vike.dev/hooksTimeout)`
      )
      reject(err)
    }, timeoutErr)
  ;(async () => {
    try {
      providePageContext(pageContextForPublicUsage)
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

function executeHookSync<PageContext extends Record<string, unknown>>(
  hook: Omit<Hook, 'hookTimeout'>,
  pageContext: PageContext,
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext
) {
  const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext)
  providePageContext(pageContextForPublicUsage)
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
  return globalObject.pageContext as any
}
/**
 * Provide `pageContext` for universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function providePageContext(pageContext: PageContextUnknown) {
  globalObject.pageContext = pageContext
  // Promise.resolve() is quicker than process.nextTick() and setImmediate()
  // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
  Promise.resolve().then(() => {
    globalObject.pageContext = null
  })
}
