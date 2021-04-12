import { route } from '../../route.shared'
import { getPageIds } from '../../routing/get-page-ids'
import { getPageInfo as getOriginalPageInfo } from '../getPage.client'
import { assertUsage } from '../../utils'
import { navigationState } from '../navigationState.client'

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
  const contextProps = {}
  const routeResult = await route(url, allPageIds, contextProps)
  if (!routeResult) {
    window.location.pathname = url
    assertUsage(false, `Could not find page for URL \`${url}\``)
  }
  const { pageId } = routeResult
  return pageId
}
