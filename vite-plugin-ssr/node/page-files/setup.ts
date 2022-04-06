import { setPageFilesAsync } from '../../shared/getPageFiles'
import { assert } from '../utils'
import { getViteDevServer } from '../globalContext'

setPageFilesAsync(getPageFilesExports)

async function getPageFilesExports(): Promise<unknown> {
  const viteDevServer = getViteDevServer()
  assert(viteDevServer)
  const moduleExports = await viteDevServer.ssrLoadModule('virtual:vite-plugin-ssr:pageFiles:server')
  const pageFilesExports: unknown = (moduleExports as any).default || (moduleExports as any)
  assert(pageFilesExports)
  return pageFilesExports
}
