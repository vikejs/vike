// This file serves the following three purposes:
//   1. Upon building the app, we ensure the right NODE_ENV value is set.
//      - Both Vue and React use NODE_ENV for enabling production-specific features:
//        - Vue: https://github.com/vuejs/core/blob/f66a75ea75c8aece065b61e2126b4c5b2338aa6e/packages/vue/index.js
//        - React: https://github.com/facebook/react/blob/01ab35a9a731dec69995fbd28f3ac7eaad11e183/packages/react/npm/index.js
//      - Setting NODE_ENV to 'production' doesn't seem to make any sense in development.
//      - With React upon building the app, setting NODE_ENV to a value other than 'production' triggers an error: https://github.com/vikejs/vike/issues/1469#issuecomment-1969301797
//      - With Vue upon building the app, NODE_ENV can be set to a value other than 'production', e.g. 'development'.
//   2. Ensure Vite isn't loaded in production.
//      - We currently only check whether Vite's development middleware is instantiated (i.e. whether Vite's `createServer()` was called). Is there a way to detect whether Vite's code is loaded?
//   3. Ensure NODE_ENV isn't mistakenly set to a wrong value.

// TODO: to fully implement the aforementioned points we need to implement a [new setting `allowNodeEnv`](https://github.com/vikejs/vike/issues/1528)

export { assertNodeEnv_build }
export { assertNodeEnv_runtime }
export { assertNodeEnv_onVikePluginLoad }
export { handleNodeEnv_prerender }
export { handleNodeEnv_vitePluginVercel }
/* Vite already sets `process.env.NODE_ENV = 'production'`
export { handleNodeEnv_build }
*/

import pc from '@brillout/picocolors'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assert, assertWarning } from './assert.js'
import { vikeVitePluginLoadedInProductionError } from './assertIsNotProductionRuntime.js'
assertIsNotBrowser()

function assertNodeEnv_build() {
  assertUsageNodeEnvIsNotDev('building')
}

function assertNodeEnv_runtime(isViteDev: boolean) {
  const nodeEnv = getNodeEnvValue()
  if (nodeEnv === null || nodeEnv === 'test') return
  const isNodeDev = isNodeEnvDev()
  // Calling Vite's createServer() is enough for hasViteDevServer to be true, even without actually adding Vite's development middleware to the server: https://github.com/vikejs/vike/issues/792#issuecomment-1516830759
  if (isViteDev === isNodeDev) return
  const nodeEnvDesc = getEnvDescription()
  // TODO: make it assertUsage() again once https://github.com/vikejs/vike/issues/1528 is implemented.
  const errMsg = `Running ${
    isViteDev ? pc.cyan('$ vike dev') : 'app in production'
  } while the ${nodeEnvDesc} which is contradictory, see https://vike.dev/NODE_ENV` as const
  assertWarning(false, errMsg, { onlyOnce: true })
}

function assertNodeEnv_onVikePluginLoad() {
  const nodeEnv = getNodeEnvValue()
  if (nodeEnv === 'test') return
  //* Let's enable this function after support for Vite's CLI is removed. (We can then abort this function if the context is `$ vike build` or `import { build } from 'vike/api';build()`.)
  if (true as boolean) return
  /*/
  if (getOperation() === 'build') return
  //*/
  // TODO: make it assertUsage() again once https://github.com/vikejs/vike/issues/1528 is implemented.
  assertWarning(
    isNodeEnvDev(),
    [
      pc.cyan(`process.env.NODE_ENV === ${JSON.stringify(nodeEnv)}`),
      '(which Vike interprets as a non-development environment https://vike.dev/NODE_ENV)',
      'while vike/plugin is loaded.',
      vikeVitePluginLoadedInProductionError
    ].join(' '),
    { onlyOnce: true }
  )
}

function handleNodeEnv_prerender() {
  if (getNodeEnvValue()) assertUsageNodeEnvIsNotDev('pre-rendering')
  setNodeEnvProduction()
  assert(getNodeEnvValue() === 'production')
}

function handleNodeEnv_vitePluginVercel() {
  setNodeEnvProduction()
}

function getNodeEnvValue(): null | undefined | string {
  if (typeof process === 'undefined') return null
  return process.env.NODE_ENV
}

function setNodeEnvProduction(): void | undefined {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4
  const proc = process
  const { env } = proc
  env.NODE_ENV = 'production'
}

function isNodeEnvDev(): boolean {
  const nodeEnv = getNodeEnvValue()
  if (!nodeEnv) return true
  if (['development', 'dev'].includes(nodeEnv)) return true
  // That's quite aggressive, let's see if some user complains
  return false
}

function getEnvDescription(): `environment is set to be a ${string} environment by process.env.NODE_ENV === ${string}` {
  const nodeEnv = getNodeEnvValue()
  const isDev = isNodeEnvDev()
  const nodeEnvDesc = `environment is set to be a ${
    (isDev ? 'development' : 'production') as string
  } environment by ${pc.cyan(`process.env.NODE_ENV === ${JSON.stringify(nodeEnv)}`)}` as const
  return nodeEnvDesc
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
