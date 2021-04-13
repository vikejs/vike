import { navigationState } from '../navigationState.client'
import { assert, assertWarning, getFileUrl, hasProp } from '../../utils'
import { parse } from '@brillout/json-s'
import { getPageInfo as getOriginalPageInfo } from '../getPage.client'
import { PageRoute } from '../../routing/types';

export { getPageProps }
export { retrievePageProps }

async function getPageProps(
  url: string,
  useOriginalDataWhenPossible: boolean = true,
  includeRoutes: boolean = true
): Promise<Record<string, unknown>> {
  if (navigationState.isOriginalUrl(url) && useOriginalDataWhenPossible) {
    const { pageProps, routes } = getOriginalPageInfo()
    return includeRoutes ? { ...pageProps, routes } : pageProps
  } else {
    const pageProps = await retrievePageProps(url, includeRoutes)
    return pageProps
  }
}

async function retrievePageProps(url: string, includeRoutes: boolean=true): Promise<Record<string, unknown>> {
  const response = await fetch(getFileUrl(url, '.pageProps.json'))
  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageProps: Record<string, unknown>, routes: PageRoute[] } | { userError: true }
  if ('userError' in responseObject) {
    assertWarning(
      false,
      `Couldn't get the \`pageProps\` for \`${url}\`: one of your hooks is throwing an error. Check out the server logs.`
    )
    const pageProps = {}
    return pageProps
  }
  assert(hasProp(responseObject, 'pageProps'))
  const { pageProps, routes } = responseObject
  assert(pageProps.constructor === Object)
  return includeRoutes ? { ...pageProps, routes } : pageProps
}
