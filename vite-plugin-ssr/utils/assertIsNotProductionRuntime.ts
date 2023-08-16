// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProductionRuntime }
export { markEnvAsDev }
export { markEnvAsPreview }
export { markEnvAsVite }
export { assertEnv }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isVitest } from './isVitest.js'

assertIsNotBrowser()

const env = getGlobalObject<{
  shouldBeVite?: true
  isDev?: true
  isPreview?: true
  isVite?: true
}>('utils/assertIsNotProductionRuntime.ts', {})

// Called by *.ts that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  env.shouldBeVite = true
}

// Called by Vite hook configureServer()
function markEnvAsDev(): void | undefined {
  env.isDev = true
}
// Called by Vite hook configurePreviewServer()
function markEnvAsPreview(): void | undefined {
  env.isPreview = true
}
// Called by ../node/plugin/index.ts
function markEnvAsVite() {
  env.isVite = true
}
// Called by ../node/runtime/index.ts
function assertEnv(): void | undefined {
  if (isVitest()) return
  if (env.isDev || env.isPreview) {
    assert(env.isVite)
    assert(env.shouldBeVite)
  } else {
    assert(!env.isVite)
    assert(!env.shouldBeVite)
  }
}
