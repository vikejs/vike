export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAllServerSide }
export { getPageFilesAllClientSide }

import { assert, isBrowser, unique } from '../utils'
import { determinePageId } from '../determinePageId'
import type { PageFile } from './types'
import { parseGlobResults } from './parseGlobResults'

assertNotAlreadyLoaded()

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

async function getPageFilesAllServerSide(isProduction: boolean) {
  assert(_pageFilesGetter)
  if (
    !_pageFilesAll ||
    // We reload all glob imports in dev to make auto-reload work
    !isProduction
  ) {
    await _pageFilesGetter()
  }
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function getPageFilesAllClientSide() {
  assert(!_pageFilesGetter)
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function assertNotAlreadyLoaded() {
  // The functionality of this file will fail if it's loaded more than
  // once; we assert that it's loaded only once.
  const alreadyLoaded = Symbol()
  const globalObject: any = isBrowser() ? window : global
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}
