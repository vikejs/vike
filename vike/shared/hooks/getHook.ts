export { getHookFromPageContext }
export { getHookFromPageConfig }
export { getHookFromPageConfigGlobal }
export { assertHook }
export { getHook_setIsPrerenderering }
export type { Hook }
export type { HookName }
export type { HookLoc }
export type { HookTimeout }
export type { HooksTimeoutProvidedByUser }

// TODO/v1-release: remove
// We export for old V0.4 design which doesn't support config.hooksTimeout
export { getHookTimeoutDefault }

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { PageConfigUserFriendlyOld } from '../getPageFiles.js'
import type { HookName, HookNamePage, HookNameGlobal } from '../page-configs/Config.js'
import type { ConfigValue, PageConfigGlobalRuntime, PageConfigRuntime } from '../page-configs/PageConfig.js'
import { getHookFilePathToShowToUser } from '../page-configs/helpers.js'
import { getConfigValueRuntime } from '../page-configs/getConfigValueRuntime.js'
import { assert, assertUsage, checkType, isCallable, isObject } from '../utils.js'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject<{ isPrerendering?: true }>('hooks/getHook.ts', {})

type Hook = HookLoc & { hookFn: HookFn; hookTimeout: HookTimeout }
type HookLoc = {
  hookName: HookName
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
type HookFn = (arg: unknown) => unknown
type HookTimeout = {
  error: number | false
  warning: number | false
}
// User Interface
type HooksTimeoutProvidedByUser = false | Partial<Record<HookName, false | Partial<HookTimeout>>>
type HooksTimeoutProvidedByUserNormalized = false | Partial<Record<HookName, Partial<HookTimeout>>>

function getHookFromPageContext(pageContext: PageConfigUserFriendlyOld, hookName: HookName): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const { hooksTimeout } = pageContext.config
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  const hookFn = pageContext.exports[hookName]
  if (hookFn === null) return null
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  const hookFilePath = file.filePath
  assert(hookFilePath)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout)
}
function getHookFromPageConfig(pageConfig: PageConfigRuntime, hookName: HookNamePage): null | Hook {
  const configValue = getConfigValueRuntime(pageConfig, hookName)
  if (!configValue?.value) return null
  const hooksTimeout = getConfigValueRuntime(pageConfig, 'hooksTimeout')?.value
  const hookTimeout = getHookTimeout(hooksTimeout, hookName)
  const { hookFn, hookFilePath } = getHookFromConfigValue(configValue)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout)
}
function getHookFromPageConfigGlobal(pageConfigGlobal: PageConfigGlobalRuntime, hookName: HookNameGlobal): null | Hook {
  const configValue = pageConfigGlobal.configValues[hookName]
  if (!configValue?.value) return null
  // TO-DO/perfection: we could use the global value of configooksTimeout but it requires some non-trivial refactoring
  const hookTimeout = getHookTimeoutDefault(hookName)
  const { hookFn, hookFilePath } = getHookFromConfigValue(configValue)
  return getHook(hookFn, hookName, hookFilePath, hookTimeout)
}
function getHookFromConfigValue(configValue: ConfigValue) {
  const hookFn = configValue.value
  assert(hookFn)
  const hookFilePath = getHookFilePathToShowToUser(configValue.definedAtData)
  // hook isn't a computed nor a cumulative config => hookFilePath should always be defined
  assert(hookFilePath)
  return { hookFn, hookFilePath }
}
function getHook(hookFn: unknown, hookName: HookName, hookFilePath: string, hookTimeout: HookTimeout): Hook {
  assertHookFn(hookFn, { hookName, hookFilePath })
  const hook = { hookFn, hookName, hookFilePath, hookTimeout }
  return hook
}

function assertHook<TPageContext extends PageConfigUserFriendlyOld, THookName extends PropertyKey & HookName>(
  pageContext: TPageContext,
  hookName: THookName
): asserts pageContext is TPageContext & { exports: Record<THookName, Function | undefined> } {
  getHookFromPageContext(pageContext, hookName)
}

function assertHookFn(
  hookFn: unknown,
  { hookName, hookFilePath }: { hookName: HookName; hookFilePath: string }
): asserts hookFn is HookFn {
  assert(hookName && hookFilePath)
  assert(!hookName.endsWith(')'))
  assert(!hookFilePath.endsWith(' '))
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

  if (globalObject.isPrerendering) {
    return {
      error: 2 * 60 * 1000,
      warning: 30 * 1000
    }
  } else {
    assert(!hookName.toLowerCase().includes('prerender'))
  }

  return {
    error: 30 * 1000,
    warning: 4 * 1000
  }
}
function getHook_setIsPrerenderering() {
  globalObject.isPrerendering = true
}
