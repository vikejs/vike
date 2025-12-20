export { getHookFromPageContext }
export { getHookFromPageContextNew }
export { getHookFromPageConfig }
export { getHookFromPageConfigGlobal }
export { getHookFromPageConfigGlobalCumulative }
export { getHook_setIsPrerenderering }
export type { Hook }
export type { HookLoc }
export type { HookTimeout }
export type { HooksTimeoutProvidedByUser }

// TO-DO/next-major-release: remove
// We export for old V0.4 design which doesn't support config.hooksTimeout
export { getHookTimeoutDefault }

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { PageContextConfig } from '../getPageFiles.js'
import type { HookNameOld, HookNamePage, HookNameGlobal, HookName, OnHookCall } from '../../types/Config.js'
import type { ConfigValue, PageConfigGlobalRuntime, PageConfigRuntime } from '../../types/PageConfig.js'
import { getHookFilePathToShowToUser } from '../page-configs/helpers.js'
import { getConfigValueRuntime } from '../page-configs/getConfigValueRuntime.js'
import { assert, assertUsage, checkType, isArray, isCallable, isObject } from '../utils.js'
import pc from '@brillout/picocolors'
import type { GlobalContextPrepareMinimum } from '../prepareGlobalContextForPublicUsage.js'
import type { PageContextPrepareMinimum } from '../preparePageContextForPublicUsage.js'
const globalObject = getGlobalObject<{ isPrerendering?: true }>('hooks/getHook.ts', {})

type HookArgDefault = PageContextPrepareMinimum
type Hook<HookArg = HookArgDefault> = HookLoc & { hookFn: HookFn<HookArg>; hookTimeout: HookTimeout }
type HookLoc = {
  hookName: HookNameOld
  /* Once we remove the old design, we'll be able to use the full path information.
   * Le'ts then do this:
   * ```diff
   * - Following error was thrown by the onRenderHtml() hook defined at vike-react/__internal/integration/onRenderHtml
   * + Following error was thrown by the onRenderHtml() hook defined by vike-react
   * ```
import type {FilePath} from '../page-configs/FilePath.js'
  hookFilePath: FilePath
  */
  hookFilePath: string
}
type HookFn<HookArg = HookArgDefault> = (arg: HookArg, ...rest: unknown[]) => unknown
type HookTimeout = {
  error: number | false
  warning: number | false
}
// User Interface
type HooksTimeoutProvidedByUser = false | Partial<Record<HookNameOld, false | Partial<HookTimeout>>>
type HooksTimeoutProvidedByUserNormalized = false | Partial<Record<HookNameOld, Partial<HookTimeout>>>

type PageContextForHook = PageContextConfig & PageContextPrepareMinimum

function getHookFromPageContext(pageContext: PageContextForHook, hookName: HookNameOld): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const pageConfigGlobal = pageContext._globalContext._pageConfigGlobal
  const { hooksTimeout } = pageContext.config
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  const hookFn = pageContext.exports[hookName]
  if (hookFn === null) return null
  // TO-DO/eventually: use pageContext.configEntries in favor of pageContext.exportsAll once V0.4 is removed
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  const hookFilePath = file.filePath
  assert(hookFilePath)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout, pageConfigGlobal)
}
// TO-DO/eventually: remove getHookFromPageContext() in favor of getHookFromPageContextNew()
function getHookFromPageContextNew(hookName: HookName, pageContext: PageContextForHook): Hook[] {
  const pageConfigGlobal = pageContext._globalContext._pageConfigGlobal
  const { hooksTimeout } = pageContext.config
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  const hooks: Hook[] = []
  /* TO-DO/eventually: use pageContext.configEntries in favor of pageContext.exportsAll once V0.4 is removed
  pageContext.configEntries[hookName]?.forEach((val) => {
    const hookFn = val.configValue
    if (hookFn === null) return
    const hookFilePath = val.configDefinedByFile
  */
  pageContext.exportsAll[hookName]?.forEach((val) => {
    const hookFn = val.exportValue
    if (hookFn === null) return
    const hookFilePath = val.filePath
    assert(hookFilePath)
    hooks.push(getHook(hookFn, hookName, hookFilePath, hookTimeout, pageConfigGlobal))
  })
  return hooks
}
function getHookFromPageConfig(
  pageConfig: PageConfigRuntime,
  hookName: HookNamePage,
  pageConfigGlobal: PageConfigGlobalRuntime,
): null | Hook {
  const configValue = getConfigValueRuntime(pageConfig, hookName)
  if (!configValue?.value) return null
  const { hookFn, hookFilePath } = getHookFromConfigValue(configValue)
  const hooksTimeout = getConfigValueRuntime(pageConfig, 'hooksTimeout')?.value
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout, pageConfigGlobal)
}
function getHookFromPageConfigGlobal(pageConfigGlobal: PageConfigGlobalRuntime, hookName: HookNameGlobal): null | Hook {
  const configValue = pageConfigGlobal.configValues[hookName]
  if (!configValue?.value) return null
  const { hookFn, hookFilePath } = getHookFromConfigValue(configValue)
  const hookTimeout = getHookTimeoutGlobal(hookName)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout, pageConfigGlobal)
}
function getHookFromPageConfigGlobalCumulative<HookArg = GlobalContextPrepareMinimum>(
  pageConfigGlobal: PageConfigGlobalRuntime,
  hookName: HookNameGlobal,
): Hook<HookArg>[] {
  const configValue = pageConfigGlobal.configValues[hookName]
  if (!configValue?.value) return []
  const val = configValue.value
  assert(isArray(val))
  return val.map((v, i) => {
    const hookFn = v
    const hookTimeout = getHookTimeoutGlobal(hookName)
    assert(isArray(configValue.definedAtData))
    const hookFilePath = getHookFilePathToShowToUser(configValue.definedAtData[i]!)
    return getHook(hookFn, hookName, hookFilePath, hookTimeout, pageConfigGlobal)
  })
}
function getHookTimeoutGlobal(hookName: HookNameOld) {
  // TO-DO/perfection: we could use the global value of configooksTimeout but it requires some non-trivial refactoring
  const hookTimeout = getHookTimeoutDefault(hookName)
  return hookTimeout
}
function getHook<HookArg = HookArgDefault>(
  hookFn: unknown,
  hookName: HookNameOld,
  hookFilePath: string,
  hookTimeout: HookTimeout,
  pageConfigGlobal: PageConfigGlobalRuntime,
): Hook<HookArg> {
  assert(hookFilePath)
  assertHookFn<HookArg>(hookFn, { hookName, hookFilePath })
  const wrappedHookFn = wrapHookFn(hookFn, hookName, hookFilePath, pageConfigGlobal)
  const hook = { hookFn: wrappedHookFn, hookName, hookFilePath, hookTimeout }
  return hook
}

function getHookFromConfigValue(configValue: ConfigValue) {
  const hookFn = configValue.value
  assert(hookFn)
  const hookFilePath = getHookFilePathToShowToUser(configValue.definedAtData)
  return { hookFn, hookFilePath }
}

function assertHookFn<HookArg = HookArgDefault>(
  hookFn: unknown,
  { hookName, hookFilePath }: { hookName: HookNameOld; hookFilePath: string },
): asserts hookFn is HookFn<HookArg> {
  assert(hookName && hookFilePath)
  assert(!hookName.endsWith(')'))
  assert(!hookFilePath.endsWith(' '))
  assertUsage(isCallable(hookFn), `Hook ${hookName}() defined by ${hookFilePath} should be a function`)
  checkType<HookFn>(hookFn)
}

function getHookTimeout(hooksTimeoutProvidedByUser: unknown, hookName: HookNameOld): HookTimeout {
  const hooksTimeoutProvidedbyUserNormalized = getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser)
  if (hooksTimeoutProvidedbyUserNormalized === false) return { error: false, warning: false }
  const providedbyUser = hooksTimeoutProvidedbyUserNormalized[hookName]
  const hookTimeout = getHookTimeoutDefault(hookName)
  if (providedbyUser?.error !== undefined) hookTimeout.error = providedbyUser.error
  if (providedbyUser?.warning !== undefined) hookTimeout.warning = providedbyUser.warning
  return hookTimeout
}

// Ideally this should be called only once and at build-time (to avoid bloating the client-side bundle), but we didn't implement any mechanism to valid config values at build-time yet
function getHooksTimeoutProvidedByUserNormalized(
  hooksTimeoutProvidedByUser: unknown,
): HooksTimeoutProvidedByUserNormalized {
  if (hooksTimeoutProvidedByUser === undefined) return {}
  if (hooksTimeoutProvidedByUser === false) return false
  assertUsage(
    isObject(hooksTimeoutProvidedByUser),
    `Setting ${pc.cyan('hooksTimeout')} should be ${pc.cyan('false')} or an object`,
  )

  const hooksTimeoutProvidedByUserNormalized: HooksTimeoutProvidedByUserNormalized = {}
  Object.entries(hooksTimeoutProvidedByUser).forEach(([hookName, hookTimeoutProvidedbyUser]) => {
    if (hookTimeoutProvidedbyUser === false) {
      hooksTimeoutProvidedByUserNormalized[hookName as HookNameOld] = { error: false, warning: false }
      return
    }
    assertUsage(
      isObject(hookTimeoutProvidedbyUser),
      `Setting ${pc.cyan(`hooksTimeout.${hookName}`)} should be ${pc.cyan('false')} or an object`,
    )
    const [error, warning] = ['error', 'warning'].map((timeoutName) => {
      const timeoutVal = hookTimeoutProvidedbyUser[timeoutName]
      if (timeoutVal === undefined || timeoutVal === false) return timeoutVal
      const errPrefix = `Setting ${pc.cyan(`hooksTimeout.${hookName}.${timeoutName}`)} should be` as const
      assertUsage(typeof timeoutVal === 'number', `${errPrefix} ${pc.cyan('false')} or a number`)
      assertUsage(timeoutVal > 0, `${errPrefix} a positive number`)
      return timeoutVal
    })
    hooksTimeoutProvidedByUserNormalized[hookName as HookNameOld] = { error, warning }
  })
  return hooksTimeoutProvidedByUserNormalized
}

function getHookTimeoutDefault(hookName: HookNameOld): HookTimeout {
  if (hookName === 'onBeforeRoute') {
    return {
      error: 5 * 1000,
      warning: 1 * 1000,
    }
  }

  if (globalObject.isPrerendering) {
    return {
      error: 2 * 60 * 1000,
      warning: 30 * 1000,
    }
  } else {
    assert(!hookName.toLowerCase().includes('prerender'))
  }

  return {
    error: 30 * 1000,
    warning: 4 * 1000,
  }
}
function getHook_setIsPrerenderering() {
  globalObject.isPrerendering = true
}

function wrapHookFn<HookArg>(
  hookFn: HookFn<HookArg>,
  hookName: HookNameOld,
  hookFilePath: string,
  pageConfigGlobal: PageConfigGlobalRuntime,
): HookFn<HookArg> {
  return function (this: unknown, ...args: unknown[]) {
    const wrappers = getOnHookCallWrappers(pageConfigGlobal)
    const callFn = () => (hookFn as Function).apply(this, args)
    if (wrappers.length === 0) return callFn()
    // First argument is pageContext for page hooks, globalContext for global hooks
    const context = args[0]
    const hook = { name: hookName, filePath: hookFilePath, call: callFn }
    let fn = callFn
    for (const wrapper of wrappers) {
      const prev = fn
      fn = () => wrapper({ ...hook, call: prev }, context)
    }
    return fn()
  }
}

function getOnHookCallWrappers(pageConfigGlobal: PageConfigGlobalRuntime): OnHookCall[] {
  const configValue = pageConfigGlobal.configValues['onHookCall']
  if (!configValue?.value || !isArray(configValue.value)) return []
  return configValue.value.filter(isCallable) as OnHookCall[]
}
