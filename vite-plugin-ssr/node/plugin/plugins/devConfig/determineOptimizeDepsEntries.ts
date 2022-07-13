export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { getPageFileObject } from '../../../../shared/getPageFiles/getPageFileObject'
//import { getFilesystemRoute } from '../../../../shared/route/resolveFilesystemRoute'
import { findPageFiles, isSSR_config, assert, makeFilePathAbsolute } from '../../utils'

async function determineOptimizeDepsEntries(config: ResolvedConfig): Promise<string[]> {
  const ssr = isSSR_config(config)
  assert(ssr === false) // In dev, `build.ssr` is always `false`

  let pageFiles = (await findPageFiles(config)).map((p) => getPageFileObject(p))
  if (pageFiles.length > 10000) {
    //const allPageIds = pageFiles.map((p) => p.pageId)
    pageFiles = pageFiles.filter((p) => {
      return p.isErrorPageFile || p.isDefaultPageFile || p.isRendererPageFile
      /*
      const url = getFilesystemRoute(
        p.pageId,
        // There is no easy way to get the `filesystemRoots` at vite-config-resolve-time
        [],
        allPageIds,
      )
      if (url === '/') {
        return true
      }
      */
    })
  }

  const entries = pageFiles.map(({ filePath }) => makeFilePathAbsolute(filePath, config))
  return entries
}
