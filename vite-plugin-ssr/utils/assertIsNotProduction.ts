// Mechanism to ensure code isn't loaded by production runtime

export { assertIsNotProduction }
export { markEnvAsDev }
export { markEnvAsPreview }
export { markEnvAsVite }
export { assertEnv }

import { assert } from './assert'
import { assertIsNotBrowser } from './assertIsNotBrowser'
import { getGlobalObject } from './getGlobalObject'
import { isVitest } from './isVitest'

assertIsNotBrowser()

const env = getGlobalObject<{
  shouldBeVite?: true
  isDev?: true
  isPreview?: true
  isVite?: true
}>('utils/assertIsNotProduction.ts', {})

// Called by *.ts that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProduction(): void | undefined {
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
