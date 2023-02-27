export { isDev as isDev_ }
export { isDev_onConfigureServer }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'

const globalObject = getGlobalObject('utils/isDev.ts', { isDev: false, isDev_wasCalled: false })

function isDev(): boolean {
  globalObject.isDev_wasCalled = true
  return globalObject.isDev
}

function isDev_onConfigureServer(): void | undefined {
  assert(!globalObject.isDev_wasCalled)
  globalObject.isDev = true
}
