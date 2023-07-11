export { getPageId }

import { route } from '../../shared/route'
import { createPageContext } from './createPageContext'

async function getPageId(url: string) {
  const pageContext = await createPageContext({ urlOriginal: url })
  const routeContext = await route(pageContext)
  const pageFilesAll = pageContext._pageFilesAll
  const pageConfigs = pageContext._pageConfigs
  if (!('pageContextAddendum' in routeContext)) {
    return { pageId: null, pageFilesAll, pageConfigs }
  }
  const pageId = routeContext.pageContextAddendum._pageId
  if (!pageId) {
    return { pageId: null, pageFilesAll, pageConfigs }
  }
  return { pageId, pageFilesAll, pageConfigs }
}
