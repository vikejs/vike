export { setPageFiles }
export { setPageFilesAsync }
export { getPageFilesAll }

import { assert, unique } from '../utils'
import type { PageFile } from './getPageFileObject'
import { parseGlobResults } from './parseGlobResults'
import { getGlobalObject } from '../../utils/getGlobalObject'
import type { PlusConfig, PlusConfigGlobal } from '../page-configs/PlusConfig'

const globalObject = getGlobalObject<{
  pageFilesAll?: PageFile[] | undefined
  plusConfigs?: PlusConfig[] | undefined
  plusConfigGlobal?: PlusConfigGlobal | undefined
  pageFilesGetter?: () => Promise<void> | undefined
}>('setPageFiles.ts', {})

function setPageFiles(pageFilesExports: unknown) {
  const { pageFiles, plusConfigs, plusConfigGlobal } = parseGlobResults(pageFilesExports)
  globalObject.pageFilesAll = pageFiles
  globalObject.plusConfigs = plusConfigs
  globalObject.plusConfigGlobal = plusConfigGlobal
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
  plusConfigs: PlusConfig[]
  plusConfigGlobal: PlusConfigGlobal
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
  const { pageFilesAll, plusConfigs, plusConfigGlobal } = globalObject
  assert(pageFilesAll && plusConfigs && plusConfigGlobal)
  const allPageIds = getAllPageIds(pageFilesAll, plusConfigs)
  return { pageFilesAll, allPageIds, plusConfigs, plusConfigGlobal }
}

function getAllPageIds(allPageFiles: PageFile[], plusConfigs: PlusConfig[]): string[] {
  const fileIds = allPageFiles.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)

  const allPageIds2 = plusConfigs.map((p) => p.pageId)

  return [...allPageIds, ...allPageIds2]
}
