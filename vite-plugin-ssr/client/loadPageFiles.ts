import { loadPageIsomorphicFiles } from '../shared/loadPageIsomorphicFiles'
import { objectAssign, notNull } from './utils'
import { getAllPageFiles } from '../shared/getPageFiles'

export { loadPageFiles }

async function loadPageFiles(pageContext: { _pageId: string }) {
  const pageFiles = {}

  const allPageFiles = await getAllPageFiles()
  objectAssign(pageFiles, { _allPageFiles: allPageFiles })

  const { Page, pageExports, pageIsomorphicFile, pageIsomorphicFileDefault } = await loadPageIsomorphicFiles({
    ...pageContext,
    ...pageFiles,
  })

  const exports: Record<string, unknown> = {}
  Object.assign(exports, pageExports)
  //pageIsomorphicFiles.forEach((pageFile) => {
  ;[pageIsomorphicFileDefault, pageIsomorphicFile].filter(notNull).forEach((pageFile) => {
    Object.assign(exports, pageFile.fileExports)
  })

  objectAssign(pageFiles, {
    Page,
    pageExports,
    exports,
    _pageIsomorphicFile: pageIsomorphicFile,
    _pageIsomorphicFileDefault: pageIsomorphicFileDefault,
  })

  return pageFiles
}
