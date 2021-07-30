import { setPageFilesAsync } from './getPageFiles.shared'
import { assert } from '../utils/assert'
import { getSsrEnv } from '../ssrEnv.node'
import { hasProp, moduleExists } from '../utils'
import { loadViteEntry } from './loadViteEntry.node'

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()

  const viteEntryFile = 'pageFiles.node.js'
  assert(moduleExists(`./${viteEntryFile}`))
  const userDist = `${ssrEnv.root}/dist`
  const pluginDist = `../../../dist`
  const prodPath = `${userDist}/server/${viteEntryFile}`
  const devPath = `${pluginDist}/esm/page-files/${viteEntryFile}`

  const errorMessage =
    'Make sure to run `vite build && vite build --ssr` before running the server with `isProduction: true`.'

  const moduleExports = await loadViteEntry({
    devPath,
    prodPath,
    errorMessage,
    viteDevServer: ssrEnv.viteDevServer,
    isProduction: ssrEnv.isProduction
  })

  const pageFiles: unknown = (moduleExports as any).pageFiles || (moduleExports as any).default.pageFiles
  assert(pageFiles)
  assert(hasProp(pageFiles, '.page'))
  return pageFiles
}
