export { determineClientEntry }

import { PageFile } from '../../../shared/getPageFiles'
import type { ClientDependency } from './ClientDependency'

function determineClientEntry({
  pageFilesClientSide,
  pageFilesServerSide,
  isHtmlOnly,
  isClientRouting,
}: {
  pageFilesClientSide: PageFile[]
  pageFilesServerSide: PageFile[]
  isHtmlOnly: boolean
  isClientRouting: boolean
}): { clientEntries: string[]; clientDependencies: ClientDependency[] } {
  let clientEntries: string[] = []

  const pageFilesServerSideOnly = pageFilesServerSide.filter((p) => !pageFilesClientSide.includes(p))

  const clientDependencies: ClientDependency[] = []
  clientDependencies.push(...pageFilesClientSide.map((p) => ({ id: p.filePath, onlyAssets: false })))
  clientDependencies.push(...pageFilesServerSideOnly.map((p) => ({ id: p.filePath, onlyAssets: true }))) // CSS & assets

  // Handle SPA & SSR pages.
  if (isHtmlOnly) {
    clientEntries = pageFilesClientSide.map(p => p.filePath)
  } else {
    // Add the vps client entry
    const clientEntry = isClientRouting
      ? // $userRoot/dist/client/entry-client-routing.js
        '@@vite-plugin-ssr/dist/esm/client/router/entry.js'
      : // $userRoot/dist/client/entry-server-routing.js
        '@@vite-plugin-ssr/dist/esm/client/entry.js'
    clientDependencies.push({ id: clientEntry, onlyAssets: false })
    clientEntries = [clientEntry]
  }

  // console.log(pageFilesClientSide, pageFilesServerSide, clientDependencies, clientEntry)
  return { clientEntries, clientDependencies }
}
