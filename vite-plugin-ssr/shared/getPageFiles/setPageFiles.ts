export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import { determinePageId } from '../determinePageId'
import type { PageConfigFile, PageFile } from './getPageFileObject'
import { parseGlobResults } from './parseGlobResults'
import { getGlobalObject } from '../../utils/getGlobalObject'

const globalObject = getGlobalObject<{
  pageFilesAll?: PageFile[] | undefined
  pageConfigFiles?: PageConfigFile[] | undefined
  pageFilesGetter?: () => Promise<void> | undefined
}>('setPageFiles.ts', {})

function setPageFiles(pageFilesExports: unknown) {
  const { pageFiles, pageConfigFiles } = parseGlobResults(pageFilesExports)
  globalObject.pageFilesAll = pageFiles
  globalObject.pageConfigFiles = pageConfigFiles
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  globalObject.pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAll(
  isClientSide: boolean,
  isProduction?: boolean
): Promise<{ pageFilesAll: PageFile[]; allPageIds: string[]; pageConfigFiles: PageConfigFile[] }> {
  if (isClientSide) {
    assert(!globalObject.pageFilesGetter)
    assert(isProduction === undefined)
  } else {
    assert(globalObject.pageFilesGetter)
    assert(typeof isProduction === 'boolean')
    if (
      !globalObject.pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      await globalObject.pageFilesGetter()
    }
  }
  const { pageFilesAll, pageConfigFiles } = globalObject
  assert(pageFilesAll && pageConfigFiles)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigFiles)
  return { pageFilesAll, allPageIds, pageConfigFiles }
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[], pageConfigFiles: PageConfigFile[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}
