export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import { determinePageId } from '../determinePageId'
import type { PageFile } from './getPageFileObject'
import { parseGlobResults } from './parseGlobResults'
import { getGlobalObject } from '../../utils/getGlobalObject'
import type { PageConfig } from './getPageConfigsFromGlob'

const globalObject = getGlobalObject<{
  pageFilesAll?: PageFile[] | undefined
  pageConfigs?: PageConfig[] | undefined
  pageFilesGetter?: () => Promise<void> | undefined
}>('setPageFiles.ts', {})

function setPageFiles(pageFilesExports: unknown) {
  const { pageFiles, pageConfigs } = parseGlobResults(pageFilesExports)
  globalObject.pageFilesAll = pageFiles
  globalObject.pageConfigs = pageConfigs
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  globalObject.pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAll(
  isClientSide: boolean,
  isProduction?: boolean
): Promise<{ pageFilesAll: PageFile[]; allPageIds: string[]; pageConfigs: PageConfig[] }> {
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
  const { pageFilesAll, pageConfigs } = globalObject
  assert(pageFilesAll && pageConfigs)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)
  return { pageFilesAll, allPageIds, pageConfigs }
}

function getAllPageIds(
  allPageFiles: { filePath: string; isDefaultPageFile: boolean }[],
  pageConfigs: PageConfig[]
): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}
