import { navigationState } from '../navigationState.client'
import { assert, assertWarning, getFileUrl, hasProp } from '../../utils'
import { parse } from '@brillout/json-s'
import { getPageInfo as getOriginalPageInfo } from '../getPage.client'

export { getPageProps }
export { retrievePageProps }

async function getPageProps(url: string): Promise<Record<string, unknown>> {
  if (navigationState.isFirstNavigation) {
    const { pageProps } = getOriginalPageInfo()
    return pageProps
  } else {
    navigationState.markNavigationChange()
    const pageProps = await retrievePageProps(url)
    return pageProps
  }
}

async function retrievePageProps(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(getFileUrl(url, '.pageProps.json'))
  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageProps: Record<string, unknown> } | { userError: true }
  if ('userError' in responseObject) {
    assertWarning(
      false,
      `Couldn't get the \`pageProps\` for \`${url}\`: one of your hooks is throwing an error. Check out the server logs.`
    )
    const pageProps = {}
    return pageProps
  }
  assert(hasProp(responseObject, 'pageProps'))
  const { pageProps } = responseObject
  assert(pageProps.constructor === Object)
  return pageProps
}
