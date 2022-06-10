export { analyzeExports }

import type { PageFile } from '../types'
import { getExportNames } from './getExportNames'
import { assertUsage } from '../../utils'

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
    const hasPageIdIsmrphFile = pageFilesServerSide.some((p) => p.pageId === pageId && p.fileType === '.page')
    if (hasPageIdIsmrphFile) {
      assertClientSideRenderHook()
      return false
    }

    const hasPageIdServerFile = pageFilesServerSide.some((p) => p.pageId === pageId && p.fileType === '.page.server')
    return hasPageIdServerFile
  }

  function assertClientSideRenderHook() {
    const hasClientSideRenderHook = pageFilesClientSide.some((p) => {
      return getExportNames(p).includes('render')
    })
    assertUsage(
      hasClientSideRenderHook,
      [
        'No client-side `render()` hook found.',
        'See https://vite-plugin-ssr.com/render-modes for more information.',
        [
          'Loaded client-side page files (none of them `export { render }`):',
          ...pageFilesClientSide.map((p, i) => ` (${i + 1}): ${p.filePath}`),
        ].join('\n'),
      ].join(' '),
    )
  }

  function isClientRouting(): boolean {
    const hasClientRoutingExport = pageFilesClientSide.some((p) => {
      return getExportNames(p).includes('clientRouting')
    })
    return hasClientRoutingExport
  }
}
