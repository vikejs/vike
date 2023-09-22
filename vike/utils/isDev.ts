export { isDev1 }
export { isDev1_onConfigureServer }
export { isDev2 }

// There isn't any reliable way to test whether Vite is ran as dev/build/preview/optimizeDep
//  - Failed attempt to make a PR: https://github.com/brillout/vite/tree/fix/config-operation

// ********
// Method 1 - most reliable
// ********
import { assert } from './assert.js'
import { getGlobalObject } from './getGlobalObject.js'
const globalObject = getGlobalObject('utils/isDev.ts', { isDev: false, isDev_wasCalled: false })
function isDev1(): boolean {
  globalObject.isDev_wasCalled = true
  return globalObject.isDev
}
function isDev1_onConfigureServer(): void | undefined {
  // configureServer() is called more than once when user presses Vite's dev server reload hotkey <r>
  if (globalObject.isDev) return
  assert(!globalObject.isDev_wasCalled)
  globalObject.isDev = true
}

// ********
// Method 2
// ********
import type { ResolvedConfig } from 'vite'
function isDev2(config: ResolvedConfig): boolean {
  const isDev =
    config.command === 'serve' &&
    // Mode is 'development' by default: https://github.com/vitejs/vite/blob/bf9c49f521b7a6730231c35754d5e1f9c3a6a16e/packages/vite/src/node/config.ts#L383
    // Note that user can override this: https://github.com/vitejs/vite/blob/bf9c49f521b7a6730231c35754d5e1f9c3a6a16e/packages/vite/src/node/cli.ts#L126
    config.mode === 'development'
  return isDev
}
