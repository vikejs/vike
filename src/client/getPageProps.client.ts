import routingState from './routingState.client'
import { assert, assertInfo, getFileUrl, hasProp } from '../utils'
import { parse } from '@brillout/json-s'
import { PageInfo } from './types'

export { getPageProps }

async function getPageProps(url: string): Promise<Record<string, unknown>> {
  if (routingState.checkIfInitialUrl(url)) {
    const pageProps = window.__vite_plugin_ssr.pageProps
    return pageProps
  }
  const pageProps = await fetchPageProps(url)
  return pageProps
}

async function fetchPageProps(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(getFileUrl(url, '.pageProps.json'))
  const responseText = await response.text()
  const responseObject = parse(responseText) as
    | { pageProps: Record<string, unknown> }
    | { userError: true }
  assertInfo(
    !('userError' in responseObject),
    `Couldn't get the \`pageProps\` for \`${url}\`: one of your hooks is throwing an error. Check out the server logs.`
  )
  assert(hasProp(responseObject, 'pageProps'))
  const { pageProps } = responseObject
  assert(pageProps.constructor === Object)
  return pageProps
}

declare global {
  interface Window {
    __vite_plugin_ssr: PageInfo
  }
}

