import { navigationState } from '../navigationState.client'
import { addUrlToContextProps, assert, assertUsage, getFileUrl, hasProp } from '../../utils'
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
  const responseText = await response.text()
  const responseObject = parse(responseText) as { contextProps: Record<string, unknown> } | { userError: true }
  if ('contextProps404PageDoesNotExist' in responseObject) {
    window.location.pathname = url
  }
  assertUsage(!('userError' in responseObject), `An error occurred on the server. Check your server logs.`)
  assert(hasProp(responseObject, 'contextProps'))
  const { contextProps } = responseObject
  assert(contextProps.constructor === Object)
  addUrlToContextProps(contextProps, url)
  return contextProps
}
