export { isClientSideRouter }
export { setIsClientSideRouter }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'
import { isBrowser } from './isBrowser'

assert(isBrowser())

const globalObject = getGlobalObject('utils/isClientSideRouter.ts', { isClientSideRouter: false })

function isClientSideRouter(): boolean {
  return globalObject.isClientSideRouter
}
function setIsClientSideRouter(): void | undefined {
  globalObject.isClientSideRouter = true
}
