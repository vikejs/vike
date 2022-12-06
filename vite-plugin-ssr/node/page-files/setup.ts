import { setPageFilesAsync } from '../../shared/getPageFiles'
import { assert, debugGlob } from '../utils'
import { getGlobalContext } from '../globalContext'
import { virtualModuleIdPageFilesServer } from '../plugin/plugins/generateImportGlobs/virtualModuleIdPageFiles'

setPageFilesAsync(getPageFilesExports)

async function getPageFilesExports(): Promise<unknown> {
  const globalContext = getGlobalContext()
  assert(!globalContext.isProduction)
  const { viteDevServer } = getGlobalContext()
  assert(viteDevServer)
  const moduleExports = await viteDevServer.ssrLoadModule(virtualModuleIdPageFilesServer)
  const pageFilesExports: unknown = (moduleExports as any).default || (moduleExports as any)
  debugGlob('Page files found: ', pageFilesExports)
  assert(pageFilesExports)
  return pageFilesExports
}
