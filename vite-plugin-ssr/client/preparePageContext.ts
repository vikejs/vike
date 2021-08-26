import { assert, objectAssign, isObject } from '../shared/utils'
import { getPageContextProxy } from './getPageContextProxy'
import { loadPageView } from '../shared/loadPageView'
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
  const pageView = await loadPageView(pageContext)
  objectAssign(pageContext, pageView)
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))

  const pageContextProxy = getPageContextProxy(pageContext)

  return pageContextProxy
}
