export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import type { PageFile } from './getPageFileObject'
import { parseGlobResults } from './parseGlobResults'
import { getGlobalObject } from '../../utils/getGlobalObject'
import type { PageConfig } from '../page-configs/PageConfig'

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

function getAllPageIds(allPageFiles: PageFile[], pageConfigs: PageConfig[]): string[] {
  const fileIds = allPageFiles.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)

  const allPageIds2 = pageConfigs.map((p) => p.pageId2)

  return [...allPageIds, ...allPageIds2]
}
