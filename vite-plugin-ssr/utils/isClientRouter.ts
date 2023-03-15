export { isClientRouter }
export { markAsClientRouter }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'

assert(isBrowser())

const globalObject = getGlobalObject('utils/isClientRouter.ts', { isClientRouter: false })

function isClientRouter(): boolean {
  return globalObject.isClientRouter
}
function markAsClientRouter(): void | undefined {
  globalObject.isClientRouter = true
}
