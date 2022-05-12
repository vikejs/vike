export { analyzeExports }

import { assert } from '../../utils'
import type { PageFile } from '../types'

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

function getExportNames(p: PageFile): string[] {
  if (p.exportNames) {
    return p.exportNames
  }
  assert(p.fileExports, p.pageId)
  const exportNames = Object.keys(p.fileExports)
  return exportNames
}
