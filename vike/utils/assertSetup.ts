export { assertIsNotProductionRuntime }
export { onSetupRuntime }
export { onSetupBuild }
export { onSetupPrerender }
export { onSetupPreview }
export { setNodeEnvProduction }
export { markSetup_viteDevServer }
export { markSetup_vitePreviewServer }
export { markSetup_vikeVitePlugin }
export { markSetup_isViteDev }

import { assert, assertUsage, assertWarning } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { createDebugger } from './debug.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isVitest } from './isVitest.js'
import pc from '@brillout/picocolors'
assertIsNotBrowser()
const debug = createDebugger('vike:setup')

const setup = getGlobalObject<{
  shouldNotBeProduction?: true
  viteDevServer?: true
  vitePreviewServer?: true
  vikeVitePlugin?: true
  isPrerendering?: true
  isPreview?: true
  // Calling Vite's `createServer()` (i.e. `createDevMiddleware()`) is enough for `setup.isViteDev` to be `true`, even without actually adding Vite's development middleware to the server: https://github.com/vikejs/vike/issues/792#issuecomment-1516830759
  isViteDev?: boolean
}>('utils/assertSetup.ts', {})

// Called by Vike modules that want to ensure that they aren't loaded by the server runtime in production
function assertIsNotProductionRuntime(): void | undefined {
  if (debug.isActivated) debug('assertIsNotProductionRuntime()', new Error().stack)
  setup.shouldNotBeProduction = true
}

function onSetupRuntime(): void | undefined {
  if (debug.isActivated) debug('assertSetup()', new Error().stack)
  if (isTest()) return
  assertNodeEnvIsNotUndefinedString()
  if (!setup.viteDevServer && setup.isViteDev === undefined) {
    // TODO: make it assertUsage() again once https://github.com/vikejs/vike/issues/1528 is implemented.
    assertWarning(
      !isNodeEnvDev(),
      `The ${getEnvDescription()}, which is contradictory because the environment seems to be a production environment (Vite isn't loaded), see https://vike.dev/NODE_ENV`,
      { onlyOnce: true }
    )
    assertUsage(
      !setup.vikeVitePlugin,
      `Loading Vike's Vite plugin (the ${pc.cyan('vike/plugin')} module) is prohibited in production.`
    )
    // This assert() one of the main goal of this file: it ensures assertIsNotProductionRuntime()
    assert(!setup.shouldNotBeProduction)
  } else {
    if (!setup.isPreview && !setup.vitePreviewServer && !setup.isPrerendering) {
      // TODO: make it assertUsage() again once https://github.com/vikejs/vike/issues/1528 is implemented.
      assertWarning(
        isNodeEnvDev(),
        `The ${getEnvDescription()}, but Vite is loaded which is prohibited in production, see https://vike.dev/NODE_ENV`,
        { onlyOnce: true }
      )
    }
    assert(setup.vikeVitePlugin)
    assert(setup.shouldNotBeProduction)
  }
}
// Ensure NODE_ENV is 'production' when building.
// - Used by both Vue and React for bundling minified version:
//   - Vue: https://github.com/vuejs/core/blob/f66a75ea75c8aece065b61e2126b4c5b2338aa6e/packages/vue/index.js
//   - React: https://github.com/facebook/react/blob/01ab35a9a731dec69995fbd28f3ac7eaad11e183/packages/react/npm/index.js
// - Required for React: setting NODE_ENV to a value other than 'production' triggers an error: https://github.com/vikejs/vike/issues/1469#issuecomment-1969301797
// - Not required for Vue: when building the app, NODE_ENV can be set to a value other than 'production', e.g. 'development'.
function onSetupBuild() {
  assertUsageNodeEnvIsNotDev('building')
  /* Not needed: Vite already sets `process.env.NODE_ENV = 'production'`
  setNodeEnvProduction()
  */
}
// Called by ../node/prerender/runPrerender.ts
function onSetupPrerender() {
  markSetup_isPrerendering()
  if (getNodeEnv()) assertUsageNodeEnvIsNotDev('pre-rendering')
  setNodeEnvProduction()
}
// Called by ../node/api/preview.ts
function onSetupPreview() {
  markSetup_isPreview()
}

function isTest() {
  return isVitest() || isNodeEnv('test')
}

// Called by Vite hook configureServer()
function markSetup_viteDevServer(): void | undefined {
  if (debug.isActivated) debug('markSetup_viteDevServer()', new Error().stack)
  setup.viteDevServer = true
}
// Called by Vite hook configurePreviewServer()
function markSetup_vitePreviewServer(): void | undefined {
  if (debug.isActivated) debug('markSetup_vitePreviewServer()', new Error().stack)
  setup.vitePreviewServer = true
}
// Called by ../node/plugin/index.ts
function markSetup_vikeVitePlugin() {
  if (debug.isActivated) debug('markSetup_vikeVitePlugin()', new Error().stack)
  setup.vikeVitePlugin = true
}
// Whether Vite is loaded and whether it's in dev mode (the value returned by `isDevCheck()`)
function markSetup_isViteDev(isViteDev: boolean) {
  if (debug.isActivated) debug('markSetup_isViteDev()', new Error().stack)
  setup.isViteDev = isViteDev
}
function markSetup_isPrerendering() {
  if (debug.isActivated) debug('markSetup_isPrerendering()', new Error().stack)
  setup.isPrerendering = true
}
function markSetup_isPreview() {
  if (debug.isActivated) debug('markSetup_isPreview()', new Error().stack)
  setup.isPreview = true
}

function assertUsageNodeEnvIsNotDev(operation: 'building' | 'pre-rendering') {
  if (!isNodeEnvDev()) return
  // TODO: make it assertUsage() again once https://github.com/vikejs/vike/issues/1528 is implemented.
  assertWarning(
    false,
    `The ${getEnvDescription()} which is forbidden upon ${operation}, see https://vike.dev/NODE_ENV`,
    { onlyOnce: true }
  )
}
function getEnvDescription(): `environment is set to be a ${string} environment by process.env.NODE_ENV===${string}` {
  const envType = `${(isNodeEnvDev() ? 'development' : 'production') as string} environment` as const
  const nodeEnvDesc =
    `environment is set to be a ${pc.bold(envType)} by ${pc.cyan(`process.env.NODE_ENV===${JSON.stringify(getNodeEnv())}`)}` as const
  return nodeEnvDesc
}

// For example, Wrangler bug replaces `process.env.NODE_ENV` with `"undefined"`
// https://github.com/cloudflare/workers-sdk/issues/7886
function assertNodeEnvIsNotUndefinedString() {
  const nodeEnv = getNodeEnv()
  assertWarning(
    nodeEnv !== 'undefined',
    `${pc.cyan('process.env.NODE_ENV==="undefined"')} which is unexpected: ${pc.cyan('process.env.NODE_ENV')} is allowed to be the *value* ${pc.cyan('undefined')} (i.e. ${pc.cyan('process.env.NODE_ENV===undefined')}) but it shouldn't be the *string* ${pc.cyan('"undefined"')} ${pc.underline('https://vike.dev/NODE_ENV')}`,
    { onlyOnce: true }
  )
}

function isNodeEnvDev(): boolean {
  const nodeEnv = getNodeEnv()
  // That's quite strict, let's see if some user complains
  return nodeEnv === undefined || isNodeEnv(['development', 'dev', ''])
}
function isNodeEnv(value: string | string[]) {
  const values = Array.isArray(value) ? value : [value]
  const nodeEnv = getNodeEnv()
  return nodeEnv !== undefined && values.includes(nodeEnv.toLowerCase())
}
function getNodeEnv(): undefined | string {
  let val: string | undefined
  try {
    val = process.env.NODE_ENV
  } catch {
    return undefined
  }
  /*
  // Should we show the following warning? So far I don't think so because of the following. Maybe we can show it once we enable users to disable warnings.
  // - The warning isn't always actionable, e.g. if it's a tool that dynamically sets `process.env.NODE_ENV`.
  // - We assume that tools use `process.env.NODE_ENV` and not someting like `const { env } = process; env.NODE_ENV`. Thus, in practice, `val` overrides `val2` so having `val!==val2` isn't an issue.
  {
    const val2 = process.env['NODE' + '_ENV']
    if (val2)
      assertWarning(
        val === val2,
        `Dynamically setting process.env.NODE_ENV to ${val2} hasn't any effect because process.env.NODE_ENV is being statically replaced to ${val}.`,
        { onlyOnce: true }
      )
  }
  //*/
  return val
}
function setNodeEnvProduction(): void | undefined {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4
  const proc = process
  const { env } = proc
  env.NODE_ENV = 'production'
  assert(isNodeEnv('production'))
}
