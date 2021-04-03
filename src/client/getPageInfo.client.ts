import { assertWarning } from '../utils'
import { navigationState } from './navigationState.client'
import { PageInfo, PageInfoPromise, PageInfoRetriever } from './types'

export { getPageInfo }
export { setPageInfoRetriever }

let retrievePageInfo: PageInfoRetriever

function setPageInfoRetriever(_retrievePageInfo: PageInfoRetriever) {
  retrievePageInfo = _retrievePageInfo
}

function getPageInfo(): PageInfoPromise {
  if (navigationState.isFirstNavigation) {
    return getOriginalPageInfo()
  } else {
    if (retrievePageInfo) {
      navigationState.markNavigationChange()
      return retrievePageInfo()
    } else {
      assertWarning(
        false,
        `\`getPage()\` returned page information for URL \`${navigationState.urlOriginal}\` instead of \`${navigationState.urlNow}\` because you didn't call \`useClientRouter()\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then make sure to call \`useClientRouter()\`.`
      )
      return getOriginalPageInfo()
    }
  }
}

function getOriginalPageInfo(): PageInfoPromise {
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
