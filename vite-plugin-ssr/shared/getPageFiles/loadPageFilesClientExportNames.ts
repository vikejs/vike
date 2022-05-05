export { loadPageFilesClientExportNames }

import type { PageFile } from './types'
import { assert } from '../utils'
import { determinePageFilesToLoad } from './determinePageFilesToLoad'

async function loadPageFilesClientExportNames(
  pageFilesAll: PageFile[],
  pageId: string,
  loadIsomorphicPageFiles: boolean,
) {
  const { pageFilesClientSide, pageFilesServerSide, isHtmlOnly } = determinePageFilesToLoad(pageFilesAll, pageId)

  await Promise.all(
    pageFilesClientSide
      .filter((p) => {
        assert(p.fileType === '.page' || p.fileType === '.page.client')
        if (loadIsomorphicPageFiles) {
          return true
        }
        return p.fileType === '.page.client'
      })
      .map((p) => p.loadExportNames?.()),
  )

  const pageContextAddendum = {
    _isHtmlOnly: isHtmlOnly,
    _pageFilesClientSide: pageFilesClientSide,
    _pageFilesServerSide: pageFilesServerSide,
  }

  return pageContextAddendum
}
