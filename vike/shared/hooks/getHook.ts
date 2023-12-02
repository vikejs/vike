export { getHook }
export { assertHook }
export { assertHookFn }
export { getHookTimeouts }
export type { Hook }
export type { HookName }
export type { HookLoc }
export type { HookTimeouts }

import { PageContextExports } from '../getPageFiles.js'
import type { ConfigBuiltIn, HookName, HooksTimeout } from '../page-configs/Config.js'
import { assert, assertUsage, checkType, isCallable } from '../utils.js'

type Hook = HookLoc & { hookFn: HookFn; hookTimeouts: HookTimeouts }
type HookLoc = { hookName: HookName; hookFilePath: string }
type HookFn = (arg: unknown) => unknown
type HookTimeouts = {
  timeoutErr: number
  timeoutWarn: number
}

function getHook(pageContext: { config: ConfigBuiltIn } & PageContextExports, hookName: HookName): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const configHooksTimeouts = pageContext.config.hooksTimeouts
  const hookTimeouts = getHookTimeouts(configHooksTimeouts, hookName)
  const hookFn = pageContext.exports[hookName]
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  if (hookFn === null) return null
  const hookFilePath = file.filePath
  assert(hookFilePath)
  assert(!hookFilePath.endsWith(' '))
  assertHookFn(hookFn, { hookName, hookFilePath })
  return { hookFn, hookName, hookFilePath, hookTimeouts }
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

function getDefaultTimeouts(hookName: HookName): HookTimeouts {
  if (hookName === 'onBeforeRoute') {
    return {
      timeoutErr: 5 * 1000,
      timeoutWarn: 1 * 1000
    }
  }
  if (hookName === 'onBeforePrerender') {
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

function getHookTimeouts(configHooksTimeouts: HooksTimeout | undefined, hookName: HookName): HookTimeouts {
  const defaultHookTimeouts = getDefaultTimeouts(hookName)
  if (!configHooksTimeouts || !(hookName in configHooksTimeouts)) {
    return defaultHookTimeouts
  }
  const timeoutErr = configHooksTimeouts[hookName]?.error || defaultHookTimeouts.timeoutErr
  const timeoutWarn = configHooksTimeouts[hookName]?.warning || defaultHookTimeouts.timeoutWarn
  return {
    timeoutErr,
    timeoutWarn
  }
}
