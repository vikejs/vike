import { setPageFilesAsync } from '../../../shared/getPageFiles.mjs'
import { assert, debugGlob, isObject } from '../utils.mjs'
import { getViteDevServer } from '../globalContext.mjs'
import { virtualFileIdImportUserCodeServer } from '../../shared/virtual-files/virtualFileImportUserCode.mjs'

setPageFilesAsync(getPageFilesExports)

async function getPageFilesExports(): Promise<Record<string, unknown>> {
  const viteDevServer = getViteDevServer()
  assert(viteDevServer)
  let moduleExports: Record<string, unknown>
  try {
    moduleExports = await viteDevServer.ssrLoadModule(virtualFileIdImportUserCodeServer)
  } catch (err) {
    debugGlob(`Glob error: ${virtualFileIdImportUserCodeServer} transpile error: `, err)
    throw err
  }
  moduleExports = (moduleExports as any).default || moduleExports
  debugGlob('Glob result: ', moduleExports)
  assert(isObject(moduleExports))
  return moduleExports
}
