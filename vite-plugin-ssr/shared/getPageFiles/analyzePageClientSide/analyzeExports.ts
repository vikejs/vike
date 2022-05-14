export { analyzeExports }

import type { PageFile } from '../types'
import { getExportNames } from './getExportNames'

function analyzeExports({
  pageFilesClientSide,
  pageFilesServerSide,
  pageId,
}: {
  pageFilesClientSide: PageFile[]
  pageFilesServerSide: PageFile[]
  pageId: string
}) {
  return { isHtmlOnly: isHtmlOnly(), isClientRouting: isClientRouting() }

  function isHtmlOnly(): boolean {
    {
      const hasPageIdIsmrphFile = pageFilesServerSide.some((p) => p.pageId === pageId && p.fileType === '.page')
      const hasPageIdServerFile = pageFilesServerSide.some((p) => p.pageId === pageId && p.fileType === '.page.server')
      if (hasPageIdServerFile && !hasPageIdIsmrphFile) {
        return true
      }
    }
    {
      const hasServerRenderHook = pageFilesClientSide.some((p) => {
        return getExportNames(p).includes('render')
      })
      return !hasServerRenderHook
    }
  }

  function isClientRouting(): boolean {
    const hasClientRoutingExport = pageFilesClientSide.some((p) => {
      return getExportNames(p).includes('clientRouting')
    })
    return hasClientRoutingExport
  }
}
