import { setPageFilesAsync } from './getPageFiles.shared'
import { assert, assertUsage } from '../utils/assert'
import { sep as pathSep, resolve as pathResolve } from 'path'
import { getSsrEnv } from '../ssrEnv.node'
import { hasProp, moduleExists } from '../utils'

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()
  const viteEntry = 'pageFiles.node'
  requireResolve(`./${viteEntry}`)
  if (ssrEnv.isProduction) {
    const modulePath = pathResolve(`${ssrEnv.root}/dist/server/${viteEntry}.js`)
    assertUsage(
      moduleExists(modulePath),
      `Build file ${modulePath} is missing. Make sure to run \`vite build && vite build --ssr\` before running the server with \`isProduction: true\`.`
    )
    const moduleExports: any = require_(modulePath)
    const pageFiles: unknown = moduleExports.pageFiles || moduleExports.default.pageFiles
    assert(pageFiles)
    assert(hasProp(pageFiles, '.page'))
    return pageFiles
  } else {
    const modulePath = requireResolve(`../../../dist/esm/page-files/${viteEntry}.js`)
    let moduleExports: any
    try {
      moduleExports = await ssrEnv.viteDevServer.ssrLoadModule(modulePath)
    } catch (err) {
      ssrEnv.viteDevServer.ssrFixStacktrace(err)
      throw err
    }
    const pageFiles: unknown = moduleExports.pageFiles || moduleExports.default.pageFiles
    assert(pageFiles)
    assert(hasProp(pageFiles, '.page'))
    return pageFiles
  }
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
