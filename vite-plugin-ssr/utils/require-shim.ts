export { addRequireShim }
export { addRequireShim_setUserRootDir }

import { assert } from './assert'
import { assertIsNotBrowser } from './assertIsNotBrowser'
import type moduleType from 'module'
import { isVitest } from './isVitest'
import { getGlobalObject } from './getGlobalObject'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'
import { pathJoin } from './path-shim'

const globalObject = getGlobalObject<{ userRootDir?: string; alreadyCalled?: true }>('utils/require-shim.ts', {})
assertIsNotBrowser()
addRequireShim()

// Add require() to ESM modules, in order to workaround https://github.com/brillout/vite-plugin-ssr/issues/701
//  - esbuild doesn't always transpile require() to import(), https://github.com/evanw/esbuild/issues/566#issuecomment-735551834
//  - Vite's esbuild workaround plugin doesn't transform require() into ESM import for Node.js, https://github.com/vitejs/vite/blob/a595b115efbd38ac31c2de62ce5dd0faca424d02/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L290
//  - Test: [/test/require-shim/](https://github.com/brillout/vite-plugin-ssr/tree/88a05ef4888d0df28a370d0ca0460bf8036aadf0/test/require-shim)
//  - Playground: https://github.com/brillout/require-shim
function addRequireShim() {
  if (globalObject.alreadyCalled) return
  globalObject.alreadyCalled = true

  let requireLocal: NodeRequire | undefined
  try {
    requireLocal = require
  } catch {}
  // If node_modules/vite-plugin-ssr/ is bundled into user code, then this file can be ESM. We have to abort because there doesn't seem to be a way to add the shim in a syncrhonous way. Adding it asynchronously leads to race conditions which is worse than not adding the shim at all.
  //   - There doesn't seem to be require() syncrhonous alternerative for ESM: https://stackoverflow.com/questions/51069002/convert-import-to-synchronous
  if (!requireLocal) return

  let module: typeof moduleType
  try {
    // Make dependency optional for Edge environments
    module = requireLocal('module')
  } catch {
    // Edge environments
    return
  }

  // We cannot use `typeof require === 'undefined'` since it's always true as this file is CJS (it lives in node_modules/vite-plugin-ssr/dist/cjs/)
  if (globalThis.require === undefined) {
    install()
  }
  assertRequireShim()

  return

  function install() {
    // In ESM modules, any `require()` occurence will fallback and use globalThis.require() (since require() isn't defined in ESM modules)
    Object.defineProperty(globalThis, 'require', {
      get() {
        // We cannot move this code block into its own function because of bundlers that inline functions. (Otherwise stack[number] can be shifted and can point to the wrong callsite.)
        let callsites: NodeJS.CallSite[]
        {
          const prepareStackTraceOrg = Error.prepareStackTrace
          // https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function/66842927#66842927
          Error.prepareStackTrace = (_, stack) => stack
          const err = new Error()
          callsites = err.stack as any as NodeJS.CallSite[]
          Error.prepareStackTrace = prepareStackTraceOrg
        }

        const callerFile = getCallerFile(callsites)

        const requireUserLand = module.createRequire(callerFile)
        // @ts-expect-error
        requireUserLand._isShimInstalledByVike = true
        return requireUserLand
      }
    })
  }

  function getCallerFile(callsites: NodeJS.CallSite[]): string {
    const caller = callsites[1]
    assert(caller)

    let fileName = caller.getFileName()
    // fileName can be undefined when Vite evaluates code (the code then doesn't belong to a file on the filesystem):
    //  - When the user tries to use require(): https//github.com/brillout/vite-plugin-ssr/issues/879
    //  - When using ssr.noExternal: https://github.com/brillout/vps-mui/tree/reprod-2 - see https://github.com/brillout/vite-plugin-ssr/discussions/901#discussioncomment-5975978
    assert(fileName || fileName === undefined)
    if (fileName === undefined) {
      const filePath = deriveFileName(caller)
      // If the assertion isn't true => the shim cannot work => the user's app will crash with certainty => we should try to resolve the situation with the user
      assert(filePath)
      fileName = filePath
    }
    assert(fileName)
    const callerFile = fileName
    return callerFile
  }

  function deriveFileName(caller: NodeJS.CallSite): string | null {
    // caller.getEvalOrigin() value is set by `# sourceURL=...`, for example at https://github.com/vitejs/vite/blob/e3db7712657232fbb9ea2499a2c6f277d2bb96a3/packages/vite/src/node/ssr/ssrModuleLoader.ts#L225
    let filePath = caller.getEvalOrigin()
    if (!filePath) return null
    if (doesPathExist(filePath)) {
      return filePath
    }

    // /test/require-shim/ => sourceUrl is relative to the user's root dir. (It seems like older Vite versions set sourceUrl to the path relative to the user's root dir, while newer Vite versions set sourceURL to the absolute path?)
    const { userRootDir } = globalObject
    if (!userRootDir) return null
    let filePathAbsolute = toPosixPath(filePath)
    assertPosixPath(userRootDir)
    filePathAbsolute = pathJoin(userRootDir, filePathAbsolute)
    if (doesPathExist(filePathAbsolute)) {
      return filePathAbsolute
    }

    return null
  }

  function doesPathExist(filePath: string) {
    assert(requireLocal)
    try {
      requireLocal.resolve(filePath)
      return true
    } catch {
      return false
    }
  }
}

// Ensure that our globalThis.require doesn't overwrite the native require() implementation
function assertRequireShim() {
  // Seems like Vitest does some unusual thing
  if (isVitest()) return
  assert(require !== globalThis.require)
  assert(!('_isShimInstalledByVike' in require))
  import('./require-shim-test')
}

function addRequireShim_setUserRootDir(userRootDir: string): void {
  globalObject.userRootDir = userRootDir
}
