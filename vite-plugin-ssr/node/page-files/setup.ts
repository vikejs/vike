import '../plugin/plugins/distLink/loadDistLink'
import { resolve, join } from 'path'
import { setPageFilesServerSideAsync } from '../../shared/getPageFiles'
import { assert } from '../utils'
import { getViteDevServer } from '../globalContext'

setPageFilesServerSideAsync(getPageFilesExports)

async function getPageFilesExports(): Promise<unknown> {
  const viteDevServer = getViteDevServer()
  assert(viteDevServer)

  // Current directory: vite-plugin-ssr/dist/cjs/node/page-files/
  const pluginRoot = join(__dirname, `../../../..`)
  const viteEntryPathDev = `${pluginRoot}/dist/esm/node/page-files/pageFiles.js`
  const viteEntryResolved = resolve(viteEntryPathDev)
  const moduleExports = await viteDevServer.ssrLoadModule(viteEntryResolved)

  const pageFilesExports: unknown = (moduleExports as any).default || (moduleExports as any)
  assert(pageFilesExports)
  return pageFilesExports
}
