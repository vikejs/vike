import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { route } from '../../shared/route'
import { getGlobalContext } from './getGlobalContext'

export { getPageId }

async function getPageId(url: string) {
  const globalContext = await getGlobalContext()
  const pageContext = {
    url,
    ...globalContext,
  }
  const pageFilesAll = globalContext._pageFilesAll
  addComputedUrlProps(pageContext)
  const routeContext = await route(pageContext)
  if (!('pageContextAddendum' in routeContext)) {
    return { pageId: null, pageFilesAll }
  }
  const pageId = routeContext.pageContextAddendum._pageId
  if (!pageId) {
    return { pageId: null, pageFilesAll }
  }
  return { pageId, pageFilesAll }
}
