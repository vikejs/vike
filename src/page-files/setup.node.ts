import { setPageFilesAsync } from './getPageFiles.shared'
import { assert, assertUsage } from '../utils/assert'
import { sep as pathSep, resolve as pathResolve } from 'path'
import { getSsrEnv } from '../ssrEnv.node'
import { hasProp } from '../utils'

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()
  const viteEntry = 'pageFiles.node'
  require.resolve(`./${viteEntry}`)
  if (ssrEnv.isProduction) {
    const modulePath = pathResolve(`${ssrEnv.root}/dist/server/${viteEntry}.js`)
    let moduleExports: any
    try {
      moduleExports = require(modulePath)
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND' || !err.message.includes(`Cannot find module '${modulePath}'`)) {
        throw err
      } else {
        assertUsage(
          false,
          `Build file ${modulePath} is missing. Make sure to run \`vite build && vite build --ssr\` before running the server with \`isProduction: true\`.`
        )
      }
    }
    const pageFiles: unknown = moduleExports.pageFiles || moduleExports.default.pageFiles
    assert(pageFiles)
    assert(hasProp(pageFiles, '.page'))
    return pageFiles
  } else {
    assert(__dirname.endsWith(['dist', 'page-files'].join(pathSep)))
    const modulePath = require.resolve(`../../page-files/${viteEntry}.ts`)
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
