export { addRequireShim }

import { assert } from './assert'
import { isBrowser } from './isBrowser'
import type moduleType from 'module'
import { isVitest } from './isVitest'

assert(!isBrowser())

// Add require() to ESM modules, in order to workaround https://github.com/brillout/vite-plugin-ssr/issues/701
//  - esbuild doesn't always transpile require() to import(), https://github.com/evanw/esbuild/issues/566#issuecomment-735551834
//  - Vite's esbuild workaround plugin doesn't transform require() into ESM import for Node.js, https://github.com/vitejs/vite/blob/a595b115efbd38ac31c2de62ce5dd0faca424d02/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L290
//  - Playground: https://github.com/brillout/require-shim
function addRequireShim() {
  let req: NodeRequire | undefined
  try {
    req = require
  } catch {}
  // If node_modules/vite-plugin-ssr is bundled into user code, then this file can be ESM. We have to abort because there doesn't seem to be a way to add the shim in a syncrhonous way. Adding it asynchronously leads to race conditions which is worse than not adding the shim at all.
  //   - No require() syncrhonous alternerative for ESM: https://stackoverflow.com/questions/51069002/convert-import-to-synchronous
  if (!req) return

  let mod: typeof moduleType
  try {
    // Make dependency optional for Edge environments
    mod = req('module')
  } catch {
    // Edge environments
    return
  }

  // We cannot use `typeof require === 'undefined'` since it's always true as this file is CJS (it lives in node_modules/vite-plugin-ssr/dist/cjs/)
  if (globalThis.require === undefined) {
    // In ESM modules, any `require()` occurence will fallback and use globalThis.require() (since require() isn't defined in ESM modules)
    Object.defineProperty(globalThis, 'require', {
      get() {
        let callerFile: string
        // We don't move this code block into its own function in order to support bundlers that inline functions. (Otherwise stack[number] will be shifted and point to the wrong callsite.)
        {
          // https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function/66842927#66842927
          const prepareStackTraceOrg = Error.prepareStackTrace
          Error.prepareStackTrace = (_, stack) => stack
          const err = new Error()
          const stack = err.stack as any as NodeJS.CallSite[]
          Error.prepareStackTrace = prepareStackTraceOrg
          const caller = stack[1]
          assert(caller)
          const fileName = caller.getFileName()
          assert(fileName)
          callerFile = fileName
        }
        const req = mod.createRequire(callerFile)
        // @ts-ignore
        req.isShimAddedByVitePluginSsr = true
        return req
      }
    })
  }
  assertRequireShim()
}

function assertRequireShim() {
  if (isVitest()) return
  // Ensure that our globalThis.require() doesn't overwrite the Node.js CJS built-in require()
  assert(require !== globalThis.require)
  assert(!('isShimAddedByVitePluginSsr' in require))
  import('./require-shim-test')
}
