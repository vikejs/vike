import { navigationState } from '../navigationState.client'
import { assert, assertUsage, getFileUrl, hasProp, isPlainObject } from '../../utils'
import { parse } from '@brillout/json-s'
import { getPageInfo as getOriginalPageInfo } from '../getPage.client'

export { getPageContext }

async function getPageContext(
  url: string,
  useOriginalDataWhenPossible: boolean = true
): Promise<Record<string, unknown>> {
  if (navigationState.isOriginalUrl(url) && useOriginalDataWhenPossible) {
    const { pageContext } = getOriginalPageInfo()
    return pageContext
  } else {
    const pageContext = await retrievePageContext(url)
    return pageContext
  }
}

async function retrievePageContext(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(getFileUrl(url, '.pageContext.json'))

  // Static hosts will return a 404
  if (response.status === 404) {
    fallbackToServerSideRouting()
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { userError: true }
  if ('pageContext404PageDoesNotExist' in responseObject) {
    fallbackToServerSideRouting()
  }
  assertUsage(!('userError' in responseObject), `An error occurred on the server. Check your server logs.`)

  assert(hasProp(responseObject, 'pageContext'))
  const { pageContext } = responseObject
  assert(isPlainObject(pageContext))
  assert(pageContext.pageId)

  return pageContext

  function fallbackToServerSideRouting() {
    window.location.pathname = url
  }
}
