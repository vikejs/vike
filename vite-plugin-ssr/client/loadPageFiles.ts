import { loadPageMainFiles } from '../shared/loadPageMainFiles'
import { objectAssign } from '../shared/utils'
import { getAllPageFiles } from '../shared/getPageFiles'

export { loadPageFiles }

async function loadPageFiles(pageContext: { _pageId: string }) {
  const pageFiles = {}

  const allPageFiles = await getAllPageFiles()
  objectAssign(pageFiles, { _allPageFiles: allPageFiles })

  const { Page, pageExports, pageMainFile, pageMainFileDefault } = await loadPageMainFiles({
    ...pageContext,
    ...pageFiles
  })
  objectAssign(pageFiles, {
    Page,
    pageExports,
    _pageMainFile: pageMainFile,
    _pageMainFileDefault: pageMainFileDefault
  })

  return pageFiles
}
