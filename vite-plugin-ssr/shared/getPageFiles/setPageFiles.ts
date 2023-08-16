export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils.js'
import type { PageFile } from './getPageFileObject.js'
import { parseGlobResults } from './parseGlobResults.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { PageConfig, PageConfigGlobal } from '../page-configs/PageConfig.js'

const globalObject = getGlobalObject<{
  pageFilesAll?: PageFile[] | undefined
  pageConfigs?: PageConfig[] | undefined
  pageConfigGlobal?: PageConfigGlobal | undefined
  pageFilesGetter?: () => Promise<void> | undefined
}>('setPageFiles.ts', {})

function setPageFiles(pageFilesExports: unknown) {
  const { pageFiles, pageConfigs, pageConfigGlobal } = parseGlobResults(pageFilesExports)
  globalObject.pageFilesAll = pageFiles
  globalObject.pageConfigs = pageConfigs
  globalObject.pageConfigGlobal = pageConfigGlobal
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  globalObject.pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAll(
  isClientSide: boolean,
  isProduction?: boolean
): Promise<{
  pageFilesAll: PageFile[]
  allPageIds: string[]
  pageConfigs: PageConfig[]
  pageConfigGlobal: PageConfigGlobal
}> {
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
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = globalObject
  assert(pageFilesAll && pageConfigs && pageConfigGlobal)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)
  return { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal }
}

function getAllPageIds(allPageFiles: PageFile[], pageConfigs: PageConfig[]): string[] {
  const fileIds = allPageFiles.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)

  const allPageIds2 = pageConfigs.map((p) => p.pageId)

  return [...allPageIds, ...allPageIds2]
}
