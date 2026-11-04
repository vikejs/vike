export { getPageContextRequestUrl }
export { pageContextJsonFileExtension }
export { pageContextJsonFileExtension_server }
export { doNotCreateExtraDirectory }
export type { ErrorPageInfo }

// This module isn't loaded by the client-side of Server Routing => we don't include `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile.js'

const pageContextJsonFileExtension = '.pageContext.json'
// The error page's request: no pre-rendered file has this name => static file servers pass the request on to the server
const pageContextJsonFileExtension_server = `.server${pageContextJsonFileExtension}`
// `/some-base-url/index.pageContext.json` instead of `/some-base-url.pageContext.json` in order to comply to common reverse proxy setups, see https://github.com/vikejs/vike/issues/443
const doNotCreateExtraDirectory = false

type ErrorPageInfo = { abortStatusCode?: number; abortReason?: unknown }

// See also node/renderPageServer/handlePageContextRequestUrl.ts
function getPageContextRequestUrl(url: string, errorPageInfo?: ErrorPageInfo): string {
  const fileExtension = errorPageInfo ? pageContextJsonFileExtension_server : pageContextJsonFileExtension
  let pageContextRequestUrl = urlToFile(url, fileExtension, doNotCreateExtraDirectory)
  if (errorPageInfo) {
    const urlObject = new URL(pageContextRequestUrl, location.href)
    urlObject.searchParams.set(
      '_vike',
      // We don't use `import { stringify } from @brillout/json-serializer` to save client-side KBs
      JSON.stringify({
        errorPageInfo,
        /* TO-DO/soon/once: pass & use previousUrl
        previousUrl: pageContext.previousPageContext.urlOriginal
        //*/
      }),
    )
    pageContextRequestUrl = urlObject.href
  }
  return pageContextRequestUrl
}
