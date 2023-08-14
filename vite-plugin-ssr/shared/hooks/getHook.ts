export { getHook }
export { assertHook }
export type { Hook }

import { PageContextExports } from '../getPageFiles'
import { assert, assertUsage, isCallable } from '../utils'

type Hook = HookLoc & { hookFn: (arg: unknown) => unknown }
type HookName = 'render' | 'onBeforeRender' | 'onRenderHtml' | 'onRenderClient' | 'guard'
type HookLoc = { hookName: HookName; hookFilePath: string }

function getHook(pageContext: PageContextExports, hookName: HookName): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const hookFn = pageContext.exports[hookName]
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  const hookFilePath = file.exportSource
  assert(hookFilePath)
  assert(!hookName.endsWith(')'))
  assertUsage(isCallable(hookFn), `hook ${hookName}() defined by ${hookFilePath} should be a function`)
  return { hookFn, hookName, hookFilePath }
}

function assertHook<PC extends PageContextExports, HookName extends PropertyKey>(
  pageContext: PC,
  hookName: HookName
): asserts pageContext is PC & { exports: Record<HookName, Function | undefined> } {
  getHook(pageContext, hookName as any)
}
