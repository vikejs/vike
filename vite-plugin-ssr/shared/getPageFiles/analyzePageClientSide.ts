export { analyzePageClientSide }
export { analyzePageClientSideInit }
export type { AnalysisResult }

import { analyzeExports } from './analyzePageClientSide/analyzeExports.js'
import { determineClientEntry } from './analyzePageClientSide/determineClientEntry.js'
import { getPageFilesClientSide } from './getAllPageIdFiles.js'
import { getPageFilesServerSide } from './getAllPageIdFiles.js'
import { assert } from '../utils.js'
import { getExportNames } from './analyzePageClientSide/getExportNames.js'
import type { PageFile } from './getPageFileObject.js'
import type { ClientDependency } from './analyzePageClientSide/ClientDependency.js'

type AnalysisResult = {
  isHtmlOnly: boolean
  isClientRouting: boolean
  clientEntries: string[]
  clientDependencies: ClientDependency[]
  pageFilesClientSide: PageFile[]
  pageFilesServerSide: PageFile[]
}

// TODO/v1-release: remove analyzePageClientSide(), use analyzeClientSide() instead
function analyzePageClientSide(pageFilesAll: PageFile[], pageId: string): AnalysisResult {
  let pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const { isHtmlOnly, isClientRouting } = analyzeExports({ pageFilesClientSide, pageFilesServerSide, pageId })

  if (isHtmlOnly) {
    // HTML-only pages don't need any client-side `render()` hook. For apps that have both HTML-only and SSR/SPA pages, we skip the `.page.client.js` file that defines `render()` for HTML-only pages.
    pageFilesClientSide = pageFilesClientSide.filter(
      (p) => p.isEnv('CLIENT_ONLY') && !getExportNames(p).includes('render')
    )
    pageFilesClientSide = removeOverridenPageFiles(pageFilesClientSide)
  }

  const { clientEntries, clientDependencies } = determineClientEntry({
    pageFilesClientSide,
    pageFilesServerSide,
    isHtmlOnly,
    isClientRouting
  })
  return { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide }
}

// TODO:v1-release: remove
async function analyzePageClientSideInit(
  pageFilesAll: PageFile[],
  pageId: string,
  { sharedPageFilesAlreadyLoaded }: { sharedPageFilesAlreadyLoaded: boolean }
) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)

  await Promise.all(
    pageFilesClientSide.map(async (p) => {
      assert(p.isEnv('CLIENT_ONLY') || p.isEnv('CLIENT_AND_SERVER'))
      if (sharedPageFilesAlreadyLoaded && p.isEnv('CLIENT_AND_SERVER')) {
        return
      }
      // TODO: Is `loadExportNames()` cached ? Does it use filesExports if possible? HMR?
      await p.loadExportNames?.()
      /*
      if (pageFile.exportNames) {
        return pageFile.exportNames.includes(clientRouting)
      }
      if (pageFile.fileExports) {
        return Object.keys(pageFile.fileExports).includes(clientRouting)
      }
      */
    })
  )
}

// [WIP] Just an experiment needed by https://vite-plugin-ssr.com/banner
//  - Not sure I want to make something like a public API: the CSS of `_default.page.server.js` are still loaded -> weird DX.
function removeOverridenPageFiles(pageFilesClientSide: PageFile[]) {
  const pageFilesClientSide_: PageFile[] = []
  for (const p of pageFilesClientSide) {
    pageFilesClientSide_.push(p)
    if (getExportNames(p).includes('overrideDefaultPages')) {
      break
    }
  }
  return pageFilesClientSide_
}
