export { getPageContextRequestUrl }

// This module isn't loaded by the client-side of Server Routing => we don't inlcude `urlToFile` to `./utils.ts`
import { urlToFile } from '../utils/urlToFile'

function getPageContextRequestUrl(url: string): string {
  const pageContextRequestUrl = urlToFile(url, '.pageContext.json', true)
  return pageContextRequestUrl
}
