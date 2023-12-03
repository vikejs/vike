export { getHook }
export { getHookFromPageConfig }
export { getHookFromPageConfigGlobal }
export { assertHook }
export type { Hook }
export type { HookName }
export type { HookLoc }
export type { HookTimeout }

// TODO/v1-release: remove
// We export for old V0.4 design which doesn't support config.hooksTimeout
export { getHookTimeoutDefault }

import type { PageContextExports } from '../getPageFiles.js'
import type { ConfigBuiltIn, HookName, HookNamePage, HookNameGlobal, HooksTimeout } from '../page-configs/Config.js'
import type { PageConfigBuildTime, PageConfigGlobalRuntime, PageConfigRuntime } from '../page-configs/PageConfig.js'
import { getConfigValue, getHookFilePathToShowToUser } from '../page-configs/helpers.js'
import { assert, assertUsage, checkType, isCallable } from '../utils.js'

type Hook = HookLoc & { hookFn: HookFn; hookTimeout: HookTimeout }
type HookLoc = { hookName: HookName; hookFilePath: string }
type HookFn = (arg: unknown) => unknown
type HookTimeout = {
  timeoutErr: number
  timeoutWarn: number
}

function getHook(pageContext: { config: ConfigBuiltIn } & PageContextExports, hookName: HookName): null | Hook {
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
  const hooksTimeout = getConfigValue(pageConfig, 'hooksTimeout')?.value as HooksTimeout
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

function getHookTimeout(hooksTimeout: HooksTimeout | undefined, hookName: HookName): HookTimeout {
  const defaultHookTimeout = getHookTimeoutDefault(hookName)
  if (!hooksTimeout || !(hookName in hooksTimeout)) {
    return defaultHookTimeout
  }
  const timeoutErr = hooksTimeout[hookName]?.error || defaultHookTimeout.timeoutErr
  const timeoutWarn = hooksTimeout[hookName]?.warning || defaultHookTimeout.timeoutWarn
  return {
    timeoutErr,
    timeoutWarn
  }
}

function getHookTimeoutDefault(hookName: HookName): HookTimeout {
  if (hookName === 'onBeforeRoute') {
    return {
      timeoutErr: 5 * 1000,
      timeoutWarn: 1 * 1000
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
      timeoutErr: 10 * 60 * 1000,
      timeoutWarn: 30 * 1000
    }
  }
  return {
    timeoutErr: 30 * 1000,
    timeoutWarn: 4 * 1000
  }
}
