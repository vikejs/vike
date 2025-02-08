export { getPageFilesAll }
export { setPageFiles }
export { setPageFilesAsync }

import { assert } from '../utils.js'
import type { PageFile } from './getPageFileObject.js'
import { parseGlobResults } from './parseGlobResults.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { PageConfigRuntime, PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'
import { type ConfigUserFriendly, getPageConfigUserFriendlyNew } from '../page-configs/getPageConfigUserFriendly.js'
import { getAllPageIds } from '../getPageConfigsRuntime.js'

const globalObject = getGlobalObject<{
  pageFilesAll?: PageFile[] | undefined
  pageConfigs?: PageConfigRuntime[] | undefined
  pageConfigGlobal?: PageConfigGlobalRuntime | undefined
  pageFilesGetter?: () => Promise<void> | undefined
  globalConfig?: ConfigUserFriendly
}>('setPageFiles.ts', {})

function setPageFiles(pageFilesExports: unknown) {
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseGlobResults(pageFilesExports)
  globalObject.pageFilesAll = pageFilesAll
  globalObject.pageConfigs = pageConfigs
  globalObject.pageConfigGlobal = pageConfigGlobal
  // TODO/now: re-use this call, instead of calling it twice
  globalObject.globalConfig = getPageConfigUserFriendlyNew(pageConfigGlobal)
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
  pageConfigs: PageConfigRuntime[]
  pageConfigGlobal: PageConfigGlobalRuntime
  globalConfig: ConfigUserFriendly
}> {
  if (isClientSide) {
    assert(!globalObject.pageFilesGetter)
    assert(isProduction === undefined)
  } else {
    assert(typeof isProduction === 'boolean')
    if (
      !globalObject.pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      assert(globalObject.pageFilesGetter)
      await globalObject.pageFilesGetter()
    }
  }
  const { pageFilesAll, pageConfigs, pageConfigGlobal, globalConfig } = globalObject
  assert(pageFilesAll && pageConfigs && pageConfigGlobal && globalConfig)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)
  return { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig }
}
