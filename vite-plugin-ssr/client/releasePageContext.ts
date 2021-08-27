import { assert, isObject } from '../shared/utils'
import { getPageContextProxy } from './getPageContextProxy'
import { sortPageContext } from '../shared/sortPageContext'

export { releasePageContext }

function releasePageContext<
  T extends { Page: unknown; pageExports: Record<string, unknown>; isHydration: boolean } & Record<string, unknown>
>(pageContext: T) {
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert([true, false].includes(pageContext.isHydration))

  sortPageContext(pageContext)

  const pageContextProxy = getPageContextProxy(pageContext)

  return pageContextProxy
}
