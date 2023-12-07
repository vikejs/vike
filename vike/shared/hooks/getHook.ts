export { getHook }
export { getHookFromPageConfig }
export { getHookFromPageConfigGlobal }
export { assertHook }
export type { Hook }
export type { HookName }
export type { HookLoc }
export type { HookTimeout }
export type { HooksTimeoutProvidedByUser }

// TODO/v1-release: remove
// We export for old V0.4 design which doesn't support config.hooksTimeout
export { getHookTimeoutDefault }

import type { PageContextExports } from '../getPageFiles.js'
import type { HookName, HookNamePage, HookNameGlobal } from '../page-configs/Config.js'
import type { PageConfigBuildTime, PageConfigGlobalRuntime, PageConfigRuntime } from '../page-configs/PageConfig.js'
import { getConfigValue, getHookFilePathToShowToUser } from '../page-configs/helpers.js'
import { assert, assertUsage, checkType, isCallable, isObject } from '../utils.js'
import pc from '@brillout/picocolors'

type Hook = HookLoc & { hookFn: HookFn; hookTimeout: HookTimeout }
type HookLoc = { hookName: HookName; hookFilePath: string }
type HookFn = (arg: unknown) => unknown
type HookTimeout = {
  error: number | false
  warning: number | false
}
// User Interface
type HooksTimeoutProvidedByUser = false | Partial<Record<HookName, false | Partial<HookTimeout>>>
type HooksTimeoutProvidedByUserNormalized = false | Partial<Record<HookName, Partial<HookTimeout>>>

function getHook(pageContext: PageContextExports, hookName: HookName): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const { hooksTimeout } = pageContext.config
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  const hookFn = pageContext.exports[hookName]
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  if (hookFn === null) return null
  const hookFilePath = file.filePath
  assert(hookFilePath)
  assert(!hookFilePath.endsWith(' '))
  assertHookFn(hookFn, { hookName, hookFilePath })
  return { hookFn, hookName, hookFilePath, hookTimeout }
}
function getHookFromPageConfig(
  pageConfig: PageConfigRuntime | PageConfigBuildTime,
  hookName: HookNamePage
): null | Hook {
  const configValue = getConfigValue(pageConfig, hookName)
  const hooksTimeout = getConfigValue(pageConfig, 'hooksTimeout')?.value
  if (!configValue) return null
  const hookFn = configValue.value
  if (!hookFn) return null
  const hookFilePath = getHookFilePathToShowToUser(configValue)
  // hook isn't a computed nor a cumulative config => definedAt should always be defined
  assert(hookFilePath)
  assertHookFn(hookFn, { hookName, hookFilePath })
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  return { hookFn, hookName, hookFilePath, hookTimeout }
}
function getHookFromPageConfigGlobal(pageConfigGlobal: PageConfigGlobalRuntime, hookName: HookNameGlobal): null | Hook {
  const configValue = pageConfigGlobal.configValues[hookName]
  if (!configValue) return null
  const hookFn = configValue.value
  if (!hookFn) return null
  const hookFilePath = getHookFilePathToShowToUser(configValue)
  // hook isn't a computed nor a cumulative config => definedAt should always be defined
  assert(hookFilePath)
  assertHookFn(hookFn, { hookName, hookFilePath })
  // We could use the global value of config.hooksTimeout but it requires some non-trivial refactoring
  const hookTimeout = getHookTimeoutDefault(hookName)
  return { hookFn, hookName, hookFilePath, hookTimeout }
}

function assertHook<TPageContext extends PageContextExports, THookName extends PropertyKey & HookName>(
  pageContext: TPageContext,
  hookName: THookName
): asserts pageContext is TPageContext & { exports: Record<THookName, Function | undefined> } {
  getHook(pageContext, hookName)
}

function assertHookFn(
  hookFn: unknown,
  { hookName, hookFilePath }: { hookName: HookName; hookFilePath: string }
): asserts hookFn is HookFn {
  assert(hookName && hookFilePath)
  assert(!hookName.endsWith(')'))
  assertUsage(isCallable(hookFn), `Hook ${hookName}() defined by ${hookFilePath} should be a function`)
  checkType<HookFn>(hookFn)
}

function getHookTimeout(hooksTimeoutProvidedByUser: unknown, hookName: HookName): HookTimeout {
  const hooksTimeoutProvidedbyUserNormalized = getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser)
  if (hooksTimeoutProvidedbyUserNormalized === false) return { error: false, warning: false }
  const providedbyUser = hooksTimeoutProvidedbyUserNormalized[hookName]
  const hookTimeout = getHookTimeoutDefault(hookName)
  if (providedbyUser?.error !== undefined) hookTimeout.error = providedbyUser.error
  if (providedbyUser?.warning !== undefined) hookTimeout.warning = providedbyUser.warning
  return hookTimeout
}

// Ideally this should be called only once and at build-time (to avoid bloating the client-side bundle), but we didn't implement any mechanism to valide config values at build-time yet
function getHooksTimeoutProvidedByUserNormalized(
  hooksTimeoutProvidedByUser: unknown
): HooksTimeoutProvidedByUserNormalized {
  if (hooksTimeoutProvidedByUser === undefined) return {}
  if (hooksTimeoutProvidedByUser === false) return false
  assertUsage(
    isObject(hooksTimeoutProvidedByUser),
    `Setting ${pc.cyan('hooksTimeout')} should be ${pc.cyan('false')} or an object`
  )

  const hooksTimeoutProvidedByUserNormalized: HooksTimeoutProvidedByUserNormalized = {}
  Object.entries(hooksTimeoutProvidedByUser).forEach(([hookName, hookTimeoutProvidedbyUser]) => {
    if (hookTimeoutProvidedbyUser === false) {
      hooksTimeoutProvidedByUserNormalized[hookName as HookName] = { error: false, warning: false }
      return
    }
    assertUsage(
      isObject(hookTimeoutProvidedbyUser),
      `Setting ${pc.cyan(`hooksTimeout.${hookName}`)} should be ${pc.cyan('false')} or an object`
    )
    const [error, warning] = ['error', 'warning'].map((timeoutName) => {
      const timeoutVal = hookTimeoutProvidedbyUser[timeoutName]
      if (timeoutVal === undefined || timeoutVal === false) return timeoutVal
      const errPrefix = `Setting ${pc.cyan(`hooksTimeout.${hookName}.${timeoutName}`)} should be` as const
      assertUsage(typeof timeoutVal === 'number', `${errPrefix} ${pc.cyan('false')} or a number`)
      assertUsage(timeoutVal > 0, `${errPrefix} a positive number`)
      return timeoutVal
    })
    hooksTimeoutProvidedByUserNormalized[hookName as HookName] = { error, warning }
  })
  return hooksTimeoutProvidedByUserNormalized
}

function getHookTimeoutDefault(hookName: HookName): HookTimeout {
  if (hookName === 'onBeforeRoute') {
    return {
      error: 5 * 1000,
      warning: 1 * 1000
    }
  }
  if (
    hookName === 'onPrerenderStart' ||
    hookName === 'onBeforePrerenderStart' ||
    // TODO/v1-release: remove
    // Old V0.4 design hooks (https://vike.dev/migration/v1-design#renamed-hooks)
    hookName === 'onBeforePrerender' ||
    hookName === 'prerender'
  ) {
    return {
      error: 10 * 60 * 1000,
      warning: 30 * 1000
    }
  }
  return {
    error: 30 * 1000,
    warning: 4 * 1000
  }
}
