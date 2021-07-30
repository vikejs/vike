import { assert, assertUsage } from '../utils/assert'
import { resolve as pathResolve } from 'path'
import { moduleExists } from '../utils/moduleExists'
import type { ViteDevServer } from 'vite'

export { loadViteEntry }

async function loadViteEntry({
  devPath,
  prodPath,
  isProduction,
  viteDevServer,
  errorMessage
}: {
  devPath: string
  prodPath: string
  isProduction: boolean
  viteDevServer: undefined | ViteDevServer
  errorMessage: string
}): Promise<unknown> {
  let moduleExports: unknown
  if (isProduction) {
    const prodPathResolved = pathResolve(prodPath)
    assertUsage(moduleExists(prodPathResolved), `Build file ${prodPathResolved} is missing. ${errorMessage}`)
    moduleExports = require_(prodPathResolved)
  } else {
    assert(viteDevServer)
    const devPathResolved = requireResolve(devPath)
    try {
      moduleExports = await viteDevServer.ssrLoadModule(devPathResolved)
    } catch (err) {
      viteDevServer.ssrFixStacktrace(err)
      throw err
    }
  }
  return moduleExports
}

function require_(modulePath: string): unknown {
  // `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
  const req = require
  return req(modulePath)
}
function requireResolve(modulePath: string): string {
  // `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
  const req = require
  return req.resolve(modulePath)
}
