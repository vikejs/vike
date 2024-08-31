export { isDev2 }
export { isDev3 }

import { assert } from './assert.js'

// We can probably remove this file after we implement the Vike CLI

// There isn't any reliable way to test whether Vite is ran as dev/build/preview/optimizeDep
//  - Failed attempt to make a PR: https://github.com/vitejs/vite/pull/12298
//    - Superseded by https://github.com/vitejs/vite/pull/14855

// ********
// Method 3 - most reliable, requires newer Vite version
// ********
import type { ConfigEnv } from 'vite'
function isDev3(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  if (command !== 'serve') return false

  // `isPreview` is `undefined` in older Vite versions.
  // https://github.com/vitejs/vite/pull/14855
  // https://github.com/vitejs/vite/pull/15695O
  // - Released at `vite@5.1.0`: https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-beta4-2024-01-26:~:text=fix(preview)%3A%20set%20isPreview%20true%20(%2315695)%20(93fce55)%2C%20closes%20%2315695
  assert(typeof isPreview === 'boolean')

  return !isPreview
}

/* This isn't reliable:
 * - https://github.com/vikejs/vike/issues/1791
 * - Calling Vite's createServer() is enough for hasViteDevServer to be true, even without actually adding Vite's development middleware to the server: https://github.com/vikejs/vike/issues/792#issuecomment-1516830759
 *
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
*/

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
