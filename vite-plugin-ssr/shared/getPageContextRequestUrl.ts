export { getPageContextRequestUrl }
export { fileExtension }
export { doNotCreateExtraDirectory }

// This module isn't loaded by the client-side of Server Routing => we don't inlcude `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile'

const fileExtension = '.pageContext.json'
const doNotCreateExtraDirectory = true

// See node/renderPage/handlePageContextRequestUrl.ts
function getPageContextRequestUrl(url: string): string {
  const pageContextRequestUrl = urlToFile(url, fileExtension, doNotCreateExtraDirectory)
  return pageContextRequestUrl
}
