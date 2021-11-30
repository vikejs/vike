import { assert, assertUsage } from '../../shared/utils/assert'
import { resolve } from 'path'
import { moduleExists } from '../../shared/utils/moduleExists'
import type { ViteDevServer } from 'vite'

export { loadViteEntry }

async function loadViteEntry({
  devPath,
  prodPath,
  isProduction,
  viteDevServer,
  errorMessage,
}: {
  devPath: string
  prodPath: string
  isProduction: boolean
  viteDevServer: undefined | ViteDevServer
  errorMessage: string
}): Promise<unknown> {
  let moduleExports: unknown
  if (isProduction) {
    const prodPathResolved = resolve(prodPath)
    assertUsage(moduleExists(prodPathResolved), `${errorMessage}. (Build file ${prodPathResolved} is missing.)`)
    moduleExports = require_(prodPathResolved)
  } else {
    assert(viteDevServer)
    const devPathResolved = requireResolve(devPath)
    moduleExports = await viteDevServer.ssrLoadModule(devPathResolved)
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
