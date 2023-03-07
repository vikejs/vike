import { setPageFilesAsync } from '../../../shared/getPageFiles'
import { assert, debugGlob, isObject } from '../../utils'
import { getGlobalContext } from '../globalContext'
import { virtualModuleIdImportUserCodeServer } from '../../commons/virtual-files/virtualFileImportUserCode'
import type { ViteDevServerEnhanced } from '../../plugin/plugins/setGlobalContext'
import type { RollupError } from 'rollup'

setPageFilesAsync(getPageFilesExports)

async function getPageFilesExports(): Promise<Record<string, unknown>> {
  const globalContext = getGlobalContext()
  assert(!globalContext.isProduction)
  const { viteDevServer } = globalContext
  assert(viteDevServer)
  const result = await transpileaAndLoadModule(virtualModuleIdImportUserCodeServer, viteDevServer)
  if ('transpileError' in result) {
    const { transpileError } = result
    debugGlob(`Glob error: ${virtualModuleIdImportUserCodeServer} transpile error: `, transpileError.message)
    throw transpileError
  } else {
    debugGlob('Glob result: ', result.moduleExports)
  }
  return result.moduleExports
}

async function transpileaAndLoadModule(
  moduleId: string,
  viteDevServer: ViteDevServerEnhanced
): Promise<{ moduleExports: Record<string, unknown> } | { transpileError: RollupError }> {
  // Avoid redudant error logging, e.g. get rid of this:
  // ```
  // Transform failed with 1 error:
  // /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config.ts:5:1: ERROR: Unexpected "}"
  // ```
  // VPS already handles `transpileError`, no need for Vite to log `err.message`
  const onErrorOriginal = viteDevServer.config.logger.error
  viteDevServer.config.logger.error = () => {}

  let result: Record<string, unknown>
  try {
    result = await viteDevServer.ssrLoadModule(moduleId)
  } catch (err) {
    if (viteDevServer.isTranspileError(err)) {
      return { transpileError: err }
    }
    throw err
  } finally {
    viteDevServer.config.logger.error = onErrorOriginal
  }

  const moduleExports: unknown = (result as any).default || (result as any)
  assert(isObject(moduleExports))
  return { moduleExports }
}
