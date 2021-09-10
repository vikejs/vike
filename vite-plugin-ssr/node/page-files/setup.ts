import { setPageFilesAsync } from '../../shared/getPageFiles'
import { assert } from '../../shared/utils/assert'
import { getSsrEnv } from '../ssrEnv'
import { hasProp } from '../../shared/utils'
import { moduleExists } from '../../shared/utils/moduleExists'
import { loadViteEntry } from './loadViteEntry'

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()

  const viteEntryFile = 'pageFiles.js'
  assert(moduleExists(`./${viteEntryFile}`, __dirname))
  const userDist = `${ssrEnv.root}/dist`
  // Current directory: vite-plugin-ssr/dist/cjs/node/page-files/
  const pluginDist = `../../../../dist`
  const prodPath = `${userDist}/server/${viteEntryFile}`
  const devPath = `${pluginDist}/esm/node/page-files/${viteEntryFile}`

  const errorMessage =
    'Make sure to run `vite build && vite build --ssr` before running your Node.js server with `createPageRenderer({ isProduction: true })`'

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
