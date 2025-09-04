export { assert }
export { assertGlobalContext }

import { getGlobalContext } from 'vike'

async function assertGlobalContext() {
  const globalContext = await getGlobalContext()
  assert(globalContext.pages['/pages/index'].config)
  assert(globalContext.pages['/pages/about-page'].config.route === '/about')
  return globalContext
}

function assert(condition, debugInfo) {
  if (condition) return
  let errMsg = 'Assertion failure.'
  if (debugInfo) errMsg += ' ' + JSON.stringify({ debugInfo })
  throw new Error(errMsg)
}
