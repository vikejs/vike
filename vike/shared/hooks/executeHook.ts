export { executeHook }
export { executeHookNew }
export { executeHookWithErrorHandling }
export { executeHookGlobalCumulative }
export { executeHookWithoutPageContext }
export { getPageContext }
export { providePageContext }
export { isUserHookError }
export type { PageContextExecuteHook }

import { getProjectError, assertWarning } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../types.js'
import type { Hook, HookLoc } from './getHook.js'
import type { PageConfigUserFriendlyOld } from '../getPageFiles.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../page-configs/Config.js'
import type { PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'
import type { PageContextForPublicUsage } from '../preparePageContextForPublicUsage.js'
const globalObject = getGlobalObject('utils/executeHook.ts', {
  userHookErrors: new WeakMap<object, HookLoc>(),
  pageContext: null as PageContextUnknown
})

type PageContextExecuteHook = PageConfigUserFriendlyOld & PageContextForPublicUsage

type HookWithResult = Hook & {
  hookResult: unknown
}

async function executeHookNew<PageContext extends PageContextExecuteHook>(
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
  preparePageContextForPublicUsage: (pageContext: PageContext) => PageContext,
  pageContextHook?: PageConfigUserFriendlyOld
) {
  const hooks = getHookFromPageContextNew(hookName, pageContextHook ?? pageContext)
  if (!hooks.length) return { hooks: [] as HookWithResult[] }
  const pageContextPrepared = preparePageContextForPublicUsage(pageContext)
  let hooksWithResult: HookWithResult[] | undefined
  let err: unknown
  try {
    hooksWithResult = await Promise.all(
      hooks.map(async (hook) => {
        const hookResult = await executeHook(() => hook.hookFn(pageContextPrepared), hook, pageContext)
        return { ...hook, hookResult }
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

async function executeHookGlobalCumulative(
  hookName: HookNameGlobal,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageContext: PageContextUnknown | null,
  arg: object
) {
  const hooks = getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName)
  await Promise.all(
    hooks.map(async (hook) => {
      await executeHook(() => hook.hookFn(arg), hook, pageContext)
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
  const hookResult = await executeHook(hookFnCaller, { hookName, hookFilePath, hookTimeout }, null)
  return hookResult
}
function executeHook<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  pageContext: PageContextUnknown
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
      providePageContext(pageContext)
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
