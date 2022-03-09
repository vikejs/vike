export { getHook }

import { PageContextExports } from './getPageFiles'
import { assert, assertUsage, isCallable } from './utils'

function getHook(
  pageContext: PageContextExports,
  hookName: 'render' | 'onBeforeRender' | 'onBeforePrerender' | 'onBeforeRoute',
): null | { hook: Function; filePath: string } {
  if (!(hookName in pageContext.exports)) {
    return null
  }
  const hook = pageContext.exports[hookName]
  const file = pageContext.exportsAll[hookName]![0]!
  assert(file.exportValue === hook)
  const { filePath } = file
  assert(filePath)
  assert(!hookName.endsWith(')'))
  assertUsage(isCallable(hook), `\`export { ${hookName} }\` of ${filePath} should be a function`)
  return { hook, filePath }
}
