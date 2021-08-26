import { AllPageFiles, findPageFile } from './getPageFiles'
import { assert, assertUsage, isObject } from './utils'

export { loadPageView }

async function loadPageView(pageContext: { _pageId: string; _allPageFiles: Pick<AllPageFiles, '.page'> }) {
  const allPageFiles = pageContext._allPageFiles
  const pageId = pageContext._pageId

  const pageFile = findPageFile(allPageFiles['.page'], pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' && ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\` or \`export default\`.`
  )
  const pageExports = fileExports
  const Page = pageExports.Page || pageExports.default
  const pageView: {
    Page: unknown
    pageExports: Record<string, unknown>
    _pageFilePath: string
  } = {
    Page,
    pageExports,
    _pageFilePath: filePath
  }
  assert('Page' in pageView)
  assert(isObject(pageView.pageExports))
  assert(typeof pageView._pageFilePath === 'string')
  return pageView
}
