export { getHook }
export { assertHook }
export { assertHookFn }
export type { Hook }
export type { HookName }
export type { HookLoc }

import { PageContextExports } from '../getPageFiles.js'
import type { ConfigBuiltIn, HookName } from '../page-configs/Config.js'
import { assert, assertUsage, checkType, isCallable } from '../utils.js'
import { getHookTimeouts, type HookTimeouts } from './getHookTimeouts.js'

type Hook = HookLoc & { hookFn: HookFn; hookTimeouts: HookTimeouts }
type HookLoc = { hookName: HookName; hookFilePath: string }
type HookFn = (arg: unknown) => unknown

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
