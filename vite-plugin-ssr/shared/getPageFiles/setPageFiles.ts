export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import { determinePageId } from '../determinePageId'
import type { PageFile } from './types'
import { parseGlobResults } from './parseGlobResults'

const pageFiles = (globalThis.__vite_plugin_ssr__pageFiles = globalThis.__vite_plugin_ssr__pageFiles || {
  pageFilesAll: undefined,
  pageFilesGetter: undefined,
})

function setPageFiles(pageFilesExports: unknown) {
  pageFiles.pageFilesAll = parseGlobResults(pageFilesExports)
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  pageFiles.pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAll(
  isClientSide: boolean,
  isProduction?: boolean,
): Promise<{ pageFilesAll: PageFile[]; allPageIds: string[] }> {
  if (isClientSide) {
    assert(!pageFiles.pageFilesGetter)
    assert(isProduction === undefined)
  } else {
    assert(pageFiles.pageFilesGetter)
    assert(typeof isProduction === 'boolean')
    if (
      !pageFiles.pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      await pageFiles.pageFilesGetter()
    }
  }
  assert(pageFiles.pageFilesAll)
  const pageFilesAll = pageFiles.pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}

declare global {
  var __vite_plugin_ssr__pageFiles: {
    pageFilesAll: PageFile[] | undefined
    pageFilesGetter: () => Promise<void> | undefined
  }
}
