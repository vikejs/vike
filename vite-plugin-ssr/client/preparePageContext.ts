import { objectAssign } from '../shared/utils'
import { getPageContextProxy } from './getPageContextProxy'
import { populatePageContext, populatePageContext_type } from '../shared/populatePageContext'
import { AllPageFiles, getAllPageFiles_clientSide } from '../shared/getPageFiles'

export { preparePageContext }

async function preparePageContext<T extends { _pageId: string }>(
  pageContext: T
): Promise<
  T & {
    Page: unknown
    pageExports: Record<string, unknown>
    _allPageFiles: Omit<AllPageFiles, '.page.server'>
  }
> {
  const allPageFiles = await getAllPageFiles_clientSide()
  objectAssign(pageContext, { _allPageFiles: allPageFiles })
  await populatePageContext(pageContext)
  populatePageContext_type(pageContext)

  const pageContextProxy = getPageContextProxy(pageContext)

  return pageContextProxy
}
