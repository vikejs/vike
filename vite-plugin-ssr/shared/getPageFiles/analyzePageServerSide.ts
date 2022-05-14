export { analyzePageServerSide }

import type { PageFile } from './types'
import { assert } from '../utils'
import { getPageFilesServerSide } from './analyzePageServerSide/getPageFilesServerSide'

async function analyzePageServerSide(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageFilesServerSideOnly = pageFilesServerSide.filter((p) => p.fileType === '.page.server')
  await Promise.all(
    pageFilesServerSideOnly.map(async (p) => {
      // In production, `exportNames` are preload
      if (p.exportNames) {
        return
      }
      assert(p.loadExportNames, pageId)
      await p.loadExportNames()
    }),
  )
  const hasOnBeforeRenderServerSideOnlyHook = pageFilesServerSideOnly.some(({ exportNames }) => {
    assert(exportNames)
    return exportNames.includes('onBeforeRender')
  })
  return { hasOnBeforeRenderServerSideOnlyHook }
}
