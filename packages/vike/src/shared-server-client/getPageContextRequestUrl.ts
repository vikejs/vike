export { getPageContextRequestUrl }
export { pageContextJsonFileExtension }
export { pageContextJsonFileExtension_server }
export { doNotCreateExtraDirectory }

// This module isn't loaded by the client-side of Server Routing => we don't include `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile.js'

const pageContextJsonFileExtension = '.pageContext.json'
// The error page's request: no pre-rendered file has this name => static file servers pass the request on to the server
const pageContextJsonFileExtension_server = `.server${pageContextJsonFileExtension}`
// `/some-base-url/index.pageContext.json` instead of `/some-base-url.pageContext.json` in order to comply to common reverse proxy setups, see https://github.com/vikejs/vike/issues/443
const doNotCreateExtraDirectory = false

// See also node/renderPageServer/handlePageContextRequestUrl.ts
function getPageContextRequestUrl(url: string, isErrorPage?: boolean): string {
  const fileExtension = isErrorPage ? pageContextJsonFileExtension_server : pageContextJsonFileExtension
  const pageContextRequestUrl = urlToFile(url, fileExtension, doNotCreateExtraDirectory)
  return pageContextRequestUrl
}
