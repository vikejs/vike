import { AllPageFiles, findPageFile } from './getPageFiles'
import { assert, assertUsage, checkType, objectAssign } from './utils'

export { populatePageContext }
export { populatePageContext_type }

type PageContextPopulated = {
  Page: unknown
  pageExports: Record<string, unknown>
}

async function populatePageContext(pageContext: { _pageId: string; _allPageFiles: Pick<AllPageFiles, '.page'> }) {
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
  objectAssign(pageContext, {
    Page,
    pageExports
  })
  checkType<PageContextPopulated>(pageContext)
}
function populatePageContext_type<PageContext extends Record<string, unknown>>(
  pageContext: PageContext
): asserts pageContext is PageContext & PageContextPopulated {
  pageContext // make TS happy
}
