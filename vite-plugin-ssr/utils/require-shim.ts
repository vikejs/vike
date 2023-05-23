export { addRequireShim }
export { addRequireShim_setUserRootDir }

import { assert } from './assert'
import { isBrowser } from './isBrowser'
import type moduleType from 'module'
import { isVitest } from './isVitest'
import { getGlobalObject } from './getGlobalObject'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'
import { pathJoin } from './path-shim'
const globalObject = getGlobalObject<{ userRootDir?: string }>('utils/require-shim.ts', {})

assert(!isBrowser())

// Add require() to ESM modules, in order to workaround https://github.com/brillout/vite-plugin-ssr/issues/701
//  - esbuild doesn't always transpile require() to import(), https://github.com/evanw/esbuild/issues/566#issuecomment-735551834
//  - Vite's esbuild workaround plugin doesn't transform require() into ESM import for Node.js, https://github.com/vitejs/vite/blob/a595b115efbd38ac31c2de62ce5dd0faca424d02/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L290
//  - Test: [/test/require-shim/](https://github.com/brillout/vite-plugin-ssr/tree/88a05ef4888d0df28a370d0ca0460bf8036aadf0/test/require-shim)
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
          let fileName = caller.getFileName()
          // fileName can be undefined when Vite evaluates code (the code then doesn't belong to a file on the filesystem):
          //  - When the user tries to use require(): https//github.com/brillout/vite-plugin-ssr/issues/879
          //  - When ssr.noExternal: https://github.com/brillout/vps-mui/tree/reprod-2 (from https://github.com/brillout/vite-plugin-ssr/discussions/901#discussioncomment-5975978)
          assert(fileName || fileName === undefined)
          if (fileName === undefined) {
            fileName = deriveFileName(caller)
          }
          if (fileName === undefined) return undefined
          assert(fileName)
          callerFile = fileName
        }
        const req = mod.createRequire(callerFile)
        // @ts-ignore
        req._isShimAddedByVitePluginSsr = true
        return req
      }
    })
  }
  assertRequireShim()
}

// Ensure that our globalThis.require doesn't overwrite the native require() implementation
function assertRequireShim() {
  // Seems like Vitest does some unusual thing
  if (isVitest()) return
  assert(require !== globalThis.require)
  assert(!('_isShimAddedByVitePluginSsr' in require))
  import('./require-shim-test')
}

function deriveFileName(caller: NodeJS.CallSite): string | undefined {
  const { userRootDir } = globalObject
  if (!userRootDir) return undefined
  // evalOrigin is set by `# sourceURL=...` at https://github.com/vitejs/vite/blob/e3db7712657232fbb9ea2499a2c6f277d2bb96a3/packages/vite/src/node/ssr/ssrModuleLoader.ts#L225
  //  - We (wrongfully?) assume that the eval is done by Vite. If that assumption is wrong then check whether the caller's filename matches /node_modules/vite/dist/node/chunks/dep-0bae2027.js
  let evalOrigin = caller.getEvalOrigin()
  if (!evalOrigin) return undefined
  evalOrigin = toPosixPath(evalOrigin)
  assertPosixPath(userRootDir)
  return pathJoin(userRootDir, evalOrigin)
}
function addRequireShim_setUserRootDir(userRootDir: string) {
  globalObject.userRootDir = userRootDir
}
