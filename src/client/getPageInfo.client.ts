import { assert, assertWarning, parseUrl } from '../utils'
import { getUrl } from './getUrl.client'
import routingState from './routingState.client'
import { PageInfo, PageInfoPromise, PageInfoRetriever } from './types';

let retrievePageInfo: PageInfoRetriever

export function setPageInfoRetriever(_retrievePageInfo: PageInfoRetriever) {
  retrievePageInfo = _retrievePageInfo
}

export function getPageInfo(): PageInfoPromise {
  const urlNow = getUrlPathname()
  if (routingState.isInitialUrl) {
    assert(urlNow)
    if (retrievePageInfo) {
      routingState.navigated = true
      return retrievePageInfo()
    } else {
      assertWarning(
        false,
        `\`getPage()\` returned page information for URL \`${routingState.urlOriginal}\` instead of \`${urlNow}\` because you didn't call \`useClientRouter()\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then make sure to call \`useClientRouter()\`.`
      )
    }
  }

  const pageId = window.__vite_plugin_ssr.pageId
  const pageIdPromise = Promise.resolve(pageId)
  const pageProps = window.__vite_plugin_ssr.pageProps
  const pagePropsPromise = Promise.resolve(pageProps)
  return { pageIdPromise, pagePropsPromise }
}

function getUrlPathname() {
  const url = getUrl()
  if (url === null) return null
  return parseUrl(url).pathname
}

declare global {
  interface Window {
    __vite_plugin_ssr: PageInfo
  }
}
