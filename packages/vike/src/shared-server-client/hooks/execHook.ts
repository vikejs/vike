// TODO: rename all exports

export { execHook }
export { execHookGlobal }
export { execHookDirect }
export { execHookDirectSingle }
export { execHookDirectSingleWithReturn }
export { execHookDirectWithoutPageContext }
export { execHookDirectSync }
export { execHookBase }
export { getPageContext_sync }
export { providePageContext }
export { isUserHookError }
export type { PageContextExecHook }

// TODO: minor refactor — maybe completely remove (some) utils.js files?
import { assert, getProjectError, assertWarning, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import type { Hook, HookLoc } from './getHook.js'
import type { PageContextConfig } from '../getPageFiles.js'
import { getHookFromPageConfigGlobalCumulative, getHookFromPageContextNew } from './getHook.js'
import type { HookName, HookNameGlobal } from '../../types/Config.js'
import { type PageContextPublicMinimum, getPageContextPublicShared } from '../getPageContextPublicShared.js'
import type { GlobalContextPublicMinimum } from '../getGlobalContextPublicShared.js'
const globalObject = getGlobalObject('utils/execHook.ts', {
  userHookErrors: new WeakMap<object, HookLoc>(),
  pageContext: null as null | PageContextExecHook,
})

type HookWithResult = Hook & {
  hookReturn: unknown
}

type PageContextExecHook = PageContextPublicMinimum

async function execHook<PageContext extends PageContextExecHook & PageContextConfig>(
  hookName: HookName,
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
) {
  const hooks = getHookFromPageContextNew(hookName, pageContext)
  return await execHookDirect(hooks, pageContext, getPageContextPublic)
}

async function execHookGlobal(
  hookName: HookNameGlobal,
  globalContext: GlobalContextPublicMinimum,
  getGlobalContextPublic: (globalContext: GlobalContextPublicMinimum) => GlobalContextPublicMinimum,
) {
  const hooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, hookName)
  const globalContextPublic = getGlobalContextPublic(globalContext)
  await Promise.all(
    hooks.map(async (hook) => {
      await execHookDirectAsync(() => hook.hookFn(globalContextPublic), hook, globalContext, null)
    }),
  )
}

async function execHookDirect<PageContext extends PageContextExecHook>(
  hooks: Hook[],
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
) {
  if (!hooks.length) return [] as HookWithResult[]
  const pageContextPublic = getPageContextPublic(pageContext)
  const hooksWithResult = await Promise.all(
    hooks.map(async (hook) => {
      const hookReturn = await execHookDirectAsync(
        () => hook.hookFn(pageContextPublic),
        hook,
        pageContext._globalContext,
        pageContextPublic,
      )
      return { ...hook, hookReturn }
    }),
  )
  return hooksWithResult
}

async function execHookDirectSingle<PageContext extends PageContextExecHook>(
  hook: Hook,
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirect([hook], pageContext, getPageContextPublic)
  const { hookReturn } = hooksWithResult[0]!
  assertUsage(
    hookReturn === undefined,
    `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`,
  )
}

async function execHookDirectSingleWithReturn<PageContext extends PageContextExecHook>(
  hook: Hook,
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
) {
  const hooksWithResult = await execHookDirect([hook], pageContext, getPageContextPublic)
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
  globalContext: GlobalContextPublicMinimum,
): Promise<HookReturn> {
  const { hookName, hookFilePath, hookTimeout } = hook
  const hookReturn = await execHookDirectAsync(
    hookFnCaller,
    { hookName, hookFilePath, hookTimeout },
    globalContext,
    null,
  )
  return hookReturn
}
function execHookDirectAsync<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookFn'>,
  globalContext: GlobalContextPublicMinimum,
  pageContextPublic: null | PageContextExecHook,
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
      const ret = await execHookBase(hookFnCaller, hook, globalContext, pageContextPublic)
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

function execHookDirectSync<PageContext extends PageContextExecHook>(
  hook: Omit<Hook, 'hookTimeout'>,
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
) {
  const pageContextPublic = getPageContextPublic(pageContext)
  const hookReturn = execHookBase(
    () => hook.hookFn(pageContextPublic),
    hook,
    pageContext._globalContext,
    pageContextPublic,
  )
  return { hookReturn }
}

// Every execHook* variant should call this
function execHookBase<HookReturn>(
  hookFnCaller: () => HookReturn,
  hook: Omit<Hook, 'hookTimeout' | 'hookFn'>,
  globalContext: GlobalContextPublicMinimum,
  pageContext: PageContextExecHook | null,
): HookReturn | Promise<HookReturn> {
  const { hookName, hookFilePath } = hook
  assert(hookName !== 'onHookCall') // ensure no infinite loop
  const configValue = globalContext._pageConfigGlobal.configValues['onHookCall']

  const callOriginal = () => {
    providePageContextInternal(pageContext)
    return hookFnCaller()
  }

  // +onHookCall doesn't exist
  if (!configValue?.value) return callOriginal()

  // +onHookCall wrapping
  let originalCalled = false
  let originalReturn: HookReturn
  let originalError: unknown
  let call = () => {
    originalCalled = true
    try {
      originalReturn = callOriginal()
    } catch (err) {
      originalError = err
    }
    return originalReturn
  }
  for (const onHookCall of configValue.value as Function[]) {
    const hookPublic = { name: hookName, filePath: hookFilePath, call }
    // Recursively wrap callOriginal() so +onHookCall can use async hooks. (E.g. vike-react-sentry integrates Sentry's `Tracer.startActiveSpan()`.)
    call = () => {
      ;(async () => {
        try {
          await onHookCall(hookPublic, pageContext)
        } catch (err) {
          console.error(err)
          /* TO-DO/eventually: use dependency injection to be able to use logErrorServer() when this function runs on the server-side.
          if (
            !globalThis.__VIKE__IS_CLIENT &&
            pageContext &&
            // Avoid infinite loop
            hookName !== 'onError'
          ) {
            assert(!pageContext.isClientSide)
            logErrorServer(err, pageContext)
          } else {
            logErrorClient(err)
          }
          //*/
        }
      })()
      // +onHookCall must run hook.call() before any `await` — https://github.com/vikejs/vike/pull/2978#discussion_r2645232953
      assertUsage(originalCalled, 'onHookCall() must run hook.call()')
      return originalReturn
    }
  }
  // Start the call() chain
  call()
  if (originalError) throw originalError
  return originalReturn!
}

function isNotDisabled(timeout: false | number): timeout is number {
  return !!timeout && timeout !== Infinity
}

function getPageContext_sync<PageContext = PageContextClient | PageContextServer>(): null | PageContext {
  const { pageContext } = globalObject
  if (!pageContext) return null
  const pageContextPublic = (pageContext as Record<string, unknown>)._isProxyObject
    ? // providePageContext() is called on the user-land (e.g. it's called by `vike-{react,vue,solid}`) thus it's already a proxy
      pageContext
    : getPageContextPublicShared(pageContext)
  return pageContextPublic as any
}
/**
 * Provide `pageContext` for universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function providePageContext(pageContext: null | PageContextClient | PageContextServer) {
  providePageContextInternal(pageContext as any)
}
function providePageContextInternal(pageContext: null | PageContextExecHook) {
  globalObject.pageContext = pageContext
  // Promise.resolve() is quicker than process.nextTick() and setImmediate()
  // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
  Promise.resolve().then(() => {
    globalObject.pageContext = null
  })
}
