export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { getPageFileObject } from '../../../../shared/getPageFiles/getPageFileObject'
import { deduceRouteStringFromFilesystemPath } from '../../../../shared/route/deduceRouteStringFromFilesystemPath'
import { findPageRouteFile } from '../../../../shared/route/loadPageRoutes'
import { getUrlFromRouteString } from '../../../../shared/route/resolveRouteString'
import { findPageFiles } from '../../helpers'
import { makeFilePathAbsolute } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'

async function determineOptimizeDepsEntries(config: ResolvedConfig, isDev: boolean): Promise<string[]> {
  const entries: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, false)
    pageConfigsData.forEach((pageConfigData) => {
      // TODO
    })
  }

  // V0.4 design
  {
    const pageFilesAll = (await findPageFiles(config, ['.page', '.page.client', '.page.route'], isDev)).map((p) =>
      getPageFileObject(p)
    )
    let pageFiles = pageFilesAll.filter((p) => p.fileType === '.page' || p.fileType === '.page.client')
    if (pageFiles.length > 10) {
      pageFiles = pageFiles.filter((p) => {
        if (p.isErrorPageFile || p.isDefaultPageFile || p.isRendererPageFile) {
          return true
        }
        if (findPageRouteFile(p.pageId, pageFilesAll)) {
          return false
        }
        {
          const routeString = deduceRouteStringFromFilesystemPath(
            p.pageId,
            // There is no easy way to get the `filesystemRoots` at Vite config resolve time
            []
          )
          const url = getUrlFromRouteString(routeString)
          return url === '/'
        }
      })
    }
    pageFiles.slice(0, 10).forEach(({ filePath }) => {
      const entry = makeFilePathAbsolute(filePath, config)
      entries.push(entry)
    })
  }

  return entries
}
