export { getHook }
export { assertHook }
export type { Hook }

import { PageContextExports } from './getPageFiles'
import { assert, assertUsage, isCallable } from './utils'

type Hook = { hookFn: (arg: unknown) => unknown; hookSrc: string }

function getHook(pageContext: PageContextExports, hookName: 'render' | 'onBeforeRender' | 'onRenderHtml'): null | Hook {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const hookFn = pageContext.exports[hookName]
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hookFn)
  const hookSrc = file.exportSource
  assert(hookSrc)
  assert(!hookName.endsWith(')'))
  assertUsage(isCallable(hookFn), `hook ${hookName}() defined by ${hookSrc} should be a function`)
  return { hookFn, hookSrc }
}

function assertHook<PC extends PageContextExports, HookName extends PropertyKey>(
  pageContext: PC,
  hookName: HookName
): asserts pageContext is PC & { exports: Record<HookName, Function | undefined> } {
  getHook(pageContext, hookName as any)
}
