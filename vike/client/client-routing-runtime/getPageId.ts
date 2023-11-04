export { getPageId }

import { route } from '../../shared/route/index.js'
import { createPageContext } from './createPageContext.js'

async function getPageId(url: string) {
  const pageContext = await createPageContext({ urlOriginal: url })
  const pageFilesAll = pageContext._pageFilesAll
  const pageConfigs = pageContext._pageConfigs
  const pageContextFromRoute = await route(pageContext)
  const pageId = pageContextFromRoute._pageId
  if (!pageId) {
    return { pageId: null, pageFilesAll, pageConfigs }
  }
  return { pageId, pageFilesAll, pageConfigs }
}
