export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import { determinePageId } from '../determinePageId'
import type { PageFile } from './types'
import { parseGlobResults } from './parseGlobResults'

let _pageFilesAll: PageFile[] | undefined
let _pageFilesGetter: () => Promise<void> | undefined

function setPageFiles(pageFilesExports: unknown) {
  _pageFilesAll = parseGlobResults(pageFilesExports)
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  _pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAll(
  isClientSide: boolean,
  isProduction?: boolean,
): Promise<{ pageFilesAll: PageFile[]; allPageIds: string[] }> {
  if (isClientSide) {
    assert(!_pageFilesGetter)
    assert(isProduction === undefined)
  } else {
    assert(_pageFilesGetter)
    assert(typeof isProduction === 'boolean')
    if (
      !_pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      await _pageFilesGetter()
    }
  }
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

declare global {
  var __vite_plugin_ssr__setPageFiles_loaded: undefined | true
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}
