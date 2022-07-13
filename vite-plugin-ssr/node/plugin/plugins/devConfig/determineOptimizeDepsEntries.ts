export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { getPageFileObject } from '../../../../shared/getPageFiles/getPageFileObject'
import { getFilesystemRoute } from '../../../../shared/route/resolveFilesystemRoute'
import { findPageRouteFile } from '../../../../shared/route/loadPageRoutes'
import { findPageFiles, toPosixPath } from '../../utils'
import fs from 'fs'

async function determineOptimizeDepsEntries(config: ResolvedConfig): Promise<string[]> {
  const pageFilesAll = (await findPageFiles(config, ['.page', '.page.client', '.page.route'])).map((p) =>
    getPageFileObject(p),
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
      const url = getFilesystemRoute(
        p.pageId,
        // There is no easy way to get the `filesystemRoots` at vite-config-resolve-time
        [],
      )
      return url === '/'
    })
  }
  pageFiles = pageFiles.slice(0, 10)

  let entries = pageFiles.map(({ filePath }) => filePath)
  entries = [writeScanTargetProxyFile(entries)]
  return entries
}

function writeScanTargetProxyFile(entries: string[]): string {
  const fileContent = entries.map((p) => `import '${p}';`).join('\n') + '\n'
  const filePath = `${__dirname}/scanTargetProxyFile.js`
  fs.writeFileSync(filePath, fileContent, 'utf8')
  return toPosixPath(filePath)
}
