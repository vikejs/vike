import { assert, assertWarning } from '../utils'
import { getUrl } from './getUrl.client'

export { getPageInfo }
export { setPageInfoRetriever }

type PageInfo = {
  pageId: string
  pageProps: Record<string, unknown>
}
type PageInfoPromise = {
  pageIdPromise: Promise<string>
  pagePropsPromise: Promise<Record<string, unknown>>
}
type PageInfoRetriever = (urlNow: string) => PageInfoPromise

let retrievePageInfo: PageInfoRetriever
function setPageInfoRetriever(_retrievePageInfo: PageInfoRetriever) {
  retrievePageInfo = _retrievePageInfo
}

let originalUrl = getUrl()
let navigated = false

function getPageInfo(): PageInfoPromise {
  const urlNow = getUrl()
  if (urlNow !== originalUrl || navigated) {
    assert(urlNow)
    if (retrievePageInfo) {
      navigated = true
      return retrievePageInfo(urlNow)
    } else {
      assertWarning(
        false,
        `\`getPage()\` returned page information for URL \`${originalUrl}\` instead of \`${urlNow}\` because you didn't call \`useClientRouter()\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then make sure to call \`useClientRouter()\`.`
      )
    }
  }

  const pageId = window.__vite_plugin_ssr.pageId
  const pageIdPromise = Promise.resolve(pageId)
  const pageProps = window.__vite_plugin_ssr.pageProps
  const pagePropsPromise = Promise.resolve(pageProps)
  return { pageIdPromise, pagePropsPromise }
}

declare global {
  interface Window {
    __vite_plugin_ssr: PageInfo
  }
}
