export { analyzePageServerSide }

import type { PageFile } from './types'
import { assert } from '../utils'
import { getRelevantPageFiles } from './getRelevantPageFiles'

async function analyzePageServerSide(pageFilesAll: PageFile[], pageId: string) {
  const { pageFilesServerSide } = getRelevantPageFiles(pageFilesAll, pageId)
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
