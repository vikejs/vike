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
// After validation and normalization
type HookTimeout = {
  error: number | false
  warning: number | false
}
type HooksTimeout = Partial<Record<HookName, HookTimeout>>
// User Interface
type HooksTimeoutProvidedByUser =
  | false
  | Partial<
      Record<
        HookName,
        | false
        | {
            error?: false | number
            warning?: false | number
          }
      >
    >

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
  const hooksTimeout = validateAndNormalizeHooksTimeout(hooksTimeoutProvidedByUser)

  const defaultHookTimeout = getHookTimeoutDefault(hookName)
  if (!hooksTimeout) return defaultHookTimeout
  const error = hooksTimeout[hookName]?.error ?? defaultHookTimeout.error
  const warning = hooksTimeout[hookName]?.warning ?? defaultHookTimeout.warning

  return {
    error,
    warning
  }
}

// Ideally this should be called only once and at build-time (to avoid bloating the client-side bundle), but we didn't implement any mechanism to valide config values at build-time yet
function validateAndNormalizeHooksTimeout(hooksTimeoutProvidedByUser: unknown): HooksTimeout {
  const hooksTimeout: HooksTimeout = {}
  if (!hooksTimeoutProvidedByUser) return hooksTimeout
  assert(
    hooksTimeoutProvidedByUser === undefined || isObject(hooksTimeoutProvidedByUser),
    `Setting ${pc.cyan('hooksTimeout')} should be an object`
  )
  Object.entries(hooksTimeoutProvidedByUser).forEach(([hookName, hookTimeout]) => {
    if (!hookTimeout) return
    assert(isObject(hookTimeout), `Setting ${pc.cyan(`hooksTimeout.${hookName}`)} should be an object`)
    const [timeoutErr, timeoutWarn] = (['error', 'warning'] as const).map((timeoutName) => {
      const timeoutVal = hookTimeout[timeoutName]
      const errPrefix = `Setting ${pc.cyan(`hooksTimeout.${hookName}.${timeoutName}`)}` as const
      assert(
        timeoutVal === false || typeof timeoutVal === 'number',
        `${errPrefix} should be ${pc.cyan('false')} or a number`
      )
      if (timeoutVal) {
        assert(timeoutVal > 0, `${errPrefix} should be a positive number`)
      }
      return timeoutVal
    })
    hooksTimeout[hookName as HookName] = {
      error: timeoutErr!,
      warning: timeoutWarn!
    }
  })
  return hooksTimeout
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
