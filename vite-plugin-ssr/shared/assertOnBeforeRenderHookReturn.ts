export { assertOnBeforeRenderHookReturn }

import { assertUsage, isPlainObject } from './utils.js'
import { assertPageContextProvidedByUser } from './assertPageContextProvidedByUser.js'
import { assertHookReturnedObject } from './assertHookReturnedObject.js'

function assertOnBeforeRenderHookReturn<Keys extends readonly string[]>(
  hookReturnValue: unknown,
  hookFilePath: string
): asserts hookReturnValue is undefined | null | { [key in Keys[number]]?: unknown } {
  if (hookReturnValue === undefined || hookReturnValue === null) {
    return
  }
  const errPrefix = `The onBeforeRender() hook defined by ${hookFilePath}` as const
  assertUsage(
    isPlainObject(hookReturnValue),
    `${errPrefix} should return a plain JavaScript object or \`undefined\`/\`null\``
  )
  assertHookReturnedObject(hookReturnValue, ['pageContext'] as const, errPrefix)
  if (hookReturnValue.pageContext) {
    assertPageContextProvidedByUser(hookReturnValue['pageContext'], { hookName: 'onBeforeRender', hookFilePath })
  }
}
