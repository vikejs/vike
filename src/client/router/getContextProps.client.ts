import { navigationState } from '../navigationState.client'
import { addUrlToContextProps, assert, assertUsage, getFileUrl, hasProp, isPlainObject } from '../../utils'
import { parse } from '@brillout/json-s'
import { getPageInfo as getOriginalPageInfo } from '../getPage.client'

export { getContextProps }

async function getContextProps(
  url: string,
  useOriginalDataWhenPossible: boolean = true
): Promise<Record<string, unknown>> {
  if (navigationState.isOriginalUrl(url) && useOriginalDataWhenPossible) {
    const { contextProps } = getOriginalPageInfo()
    return contextProps
  } else {
    const contextProps = await retrieveContextProps(url)
    return contextProps
  }
}

async function retrieveContextProps(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(getFileUrl(url, '.contextProps.json'))

  // Static hosts will return a 404
  if (response.status === 404) {
    fallbackToServerSideRouting()
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { contextProps: Record<string, unknown> } | { userError: true }
  if ('contextProps404PageDoesNotExist' in responseObject) {
    fallbackToServerSideRouting()
  }
  assertUsage(!('userError' in responseObject), `An error occurred on the server. Check your server logs.`)

  assert(hasProp(responseObject, 'contextProps'))
  const { contextProps } = responseObject
  assert(isPlainObject(contextProps))

  addUrlToContextProps(contextProps, url)

  return contextProps

  function fallbackToServerSideRouting() {
    window.location.pathname = url
  }
}
