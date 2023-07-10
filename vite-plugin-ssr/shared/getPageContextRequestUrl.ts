export { getPageContextRequestUrl }
export { pageContextJsonFileExtension }
export { doNotCreateExtraDirectory }

// This module isn't loaded by the client-side of Server Routing => we don't inlcude `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile'

const pageContextJsonFileExtension = '.pageContext.json'
// `/some-base-url/index.pageContext.json` instead of `/some-base-url.pageContext.json` in order to comply to common reverse proxy setups, see https://github.com/brillout/vite-plugin-ssr/issues/443
const doNotCreateExtraDirectory = false

// See node/renderPage/handlePageContextRequestUrl.ts
function getPageContextRequestUrl(url: string): string {
  const pageContextRequestUrl = urlToFile(url, pageContextJsonFileExtension, doNotCreateExtraDirectory)
  return pageContextRequestUrl
}
