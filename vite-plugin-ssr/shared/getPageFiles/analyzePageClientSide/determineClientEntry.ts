export { determineClientEntry }
export { getVPSClientEntry }

import type { ClientDependency } from './ClientDependency'
import type { PageFile } from '../../../shared/getPageFiles'

function determineClientEntry({
  pageFilesClientSide,
  pageFilesServerSide,
  isHtmlOnly,
  isClientRouting
}: {
  pageFilesClientSide: PageFile[]
  pageFilesServerSide: PageFile[]
  isHtmlOnly: boolean
  isClientRouting: boolean
}): { clientEntries: string[]; clientDependencies: ClientDependency[] } {
  let clientEntries: string[] = []

  const pageFilesServerSideOnly = pageFilesServerSide.filter((p) => !pageFilesClientSide.includes(p))

  const clientDependencies: ClientDependency[] = []
  clientDependencies.push(
    ...pageFilesClientSide.map((p) => ({ id: p.filePath, onlyAssets: false, eagerlyImported: false }))
  )
  // CSS & assets
  clientDependencies.push(
    ...pageFilesServerSideOnly.map((p) => ({ id: p.filePath, onlyAssets: true, eagerlyImported: false }))
  )

  // Handle SPA & SSR pages.
  if (isHtmlOnly) {
    clientEntries = pageFilesClientSide.map((p) => p.filePath)
  } else {
    // Add the vps client entry
    const clientEntry = getVPSClientEntry(isClientRouting)
    clientDependencies.push({ id: clientEntry, onlyAssets: false, eagerlyImported: false })
    clientEntries = [clientEntry]
  }

  // console.log(pageFilesClientSide, pageFilesServerSide, clientDependencies, clientEntry)
  return { clientEntries, clientDependencies }
}

function getVPSClientEntry(isClientRouting: boolean) {
  return isClientRouting
    ? // dist/client/entries/entry-client-routing.js
      '@@vite-plugin-ssr/dist/esm/client/router/entry.js'
    : // dist/client/entries/entry-server-routing.js
      '@@vite-plugin-ssr/dist/esm/client/entry.js'
}
