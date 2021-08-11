/* TODO: Check whether `@vite-plugin-ssr/vue-router` needs this file and, if not, remove it.
import { route, getPageIds, getErrorPageId } from '../../route.shared'
import { getPageInfo as getOriginalPageInfo } from '../getPage'
import { assertUsage } from '../../utils'
import { navigationState } from '../navigationState'

export { getPageId }

async function getPageId(url: string, useOriginalDataWhenPossible: boolean = true): Promise<string> {
  if (navigationState.isOriginalUrl(url) && useOriginalDataWhenPossible) {
    const { pageId } = getOriginalPageInfo()
    return pageId
  } else {
    const pageId = await retrievePageId(url)
    return pageId
  }
}

export { retrievePageId }

async function retrievePageId(url: string): Promise<string> {
  const allPageIds = await getPageIds()
  const pageContext = {}
  const routeResult = await route(url, allPageIds, pageContext)
  if (routeResult) {
    return routeResult.pageId
  }
  const errorPageId = getErrorPageId(allPageIds)
  assertUsage(errorPageId, `No page is matching the URL \`${url}\`. Make sure to define an \`_error.page.js\`.`)
  return errorPageId
}
*/
