export { determineClientEntry }

import { PageFile } from '../../shared/getPageFiles'
import type { ClientDependency } from '../retrievePageAssets'
import { assert } from '../utils'

function determineClientEntry(pageContext: {
  _pageFilesClientSide: PageFile[]
  _pageFilesServerSide: PageFile[]
  _isHtmlOnly: boolean
}): { clientEntry: null | string; clientDependencies: ClientDependency[] } {
  let clientEntry: null | string = null

  const pageFilesClientSide = pageContext._pageFilesClientSide
  const pageFilesServerSideOnly = pageContext._pageFilesServerSide.filter((p) => !pageFilesClientSide.includes(p))

  const clientDependencies: ClientDependency[] = []
  clientDependencies.push(...pageFilesClientSide.map((p) => ({ id: p.filePath, onlyAssets: false })))
  clientDependencies.push(...pageFilesServerSideOnly.map((p) => ({ id: p.filePath, onlyAssets: true }))) // CSS & assets

  // Handle SPA & SSR pages.
  if (pageContext._isHtmlOnly) {
    if (pageFilesClientSide[0]) {
      assert(pageFilesClientSide.length === 1)
      clientEntry = pageFilesClientSide[0].filePath
    }
  } else {
    // Add the vps client entry
    {
      const usesClientRouting = pageFilesClientSide.some((p) => definesClientRouting(p))
      clientEntry = usesClientRouting
        ? // $userRoot/dist/client/entry-client-routing.js
          '@@vite-plugin-ssr/dist/esm/client/router/entry.js'
        : // $userRoot/dist/client/entry-server-routing.js
          '@@vite-plugin-ssr/dist/esm/client/entry.js'
      clientDependencies.push({ id: clientEntry, onlyAssets: false })
    }
  }

  // console.log(pageContext._pageFilesClientSide, pageContext._pageFilesServerSide, clientDependencies, clientEntry)
  return { clientEntry, clientDependencies }
}

function definesClientRouting(pageFile: PageFile): boolean {
  const clientRouting = 'clientRouting'
  if (pageFile.exportNames) {
    return pageFile.exportNames.includes(clientRouting)
  }
  if (pageFile.fileExports) {
    return Object.keys(pageFile.fileExports).includes(clientRouting)
  }
  assert(false)
}
