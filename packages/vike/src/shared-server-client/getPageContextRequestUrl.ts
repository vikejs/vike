export { getPageContextRequestUrl }
export { pageContextJsonFileExtension }
export { pageContextJsonFileExtension_errorPage }
export { doNotCreateExtraDirectory }

// This module isn't loaded by the client-side of Server Routing => we don't include `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile.js'

const pageContextJsonFileExtension = '.pageContext.json'
// The error page's pageContext: no pre-rendered file has this name, so that static file servers (e.g. express.static()) pass the request on to Vike's middleware
const pageContextJsonFileExtension_errorPage = '.error.pageContext.json'
// `/some-base-url/index.pageContext.json` instead of `/some-base-url.pageContext.json` in order to comply to common reverse proxy setups, see https://github.com/vikejs/vike/issues/443
const doNotCreateExtraDirectory = false

// See also node/renderPageServer/handlePageContextRequestUrl.ts
function getPageContextRequestUrl(url: string, isErrorPage = false): string {
  const pageContextRequestUrl = urlToFile(
    url,
    isErrorPage ? pageContextJsonFileExtension_errorPage : pageContextJsonFileExtension,
    doNotCreateExtraDirectory,
  )
  return pageContextRequestUrl
}
