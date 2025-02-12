export { getPageConfigsRuntime }
export { getAllPageIds }

import type { PageFile } from './getPageFiles.js'
import { parseGlobResults } from './getPageFiles/parseGlobResults.js'
import {
  type ConfigUserFriendly,
  getPageConfigUserFriendlyNew,
  type PageConfigsUserFriendly
} from './page-configs/getPageConfigUserFriendly.js'
import type { PageConfigGlobalRuntime, PageConfigRuntime } from './page-configs/PageConfig.js'
import { unique } from './utils.js'

function getPageConfigsRuntime(virtualFileExports: unknown): {
  pageFilesAll: PageFile[]
  allPageIds: string[]
  pageConfigs: PageConfigRuntime[]
  pageConfigGlobal: PageConfigGlobalRuntime
  globalConfig: ConfigUserFriendly
  pageConfigsUserFriendly: PageConfigsUserFriendly
} {
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseGlobResults(virtualFileExports)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)
  // TODO/now: re-use this call, instead of calling it twice
  const globalConfig = getPageConfigUserFriendlyNew(pageConfigGlobal)

  // TODO/now DEDUPE
  const pageConfigsUserFriendly: PageConfigsUserFriendly = Object.fromEntries(
    pageConfigs.map((pageConfig) => {
      const configValues = { ...pageConfigGlobal.configValues, ...pageConfig.configValues }
      const page = {
        ...getPageConfigUserFriendlyNew({ configValues }),
        route: pageConfig.routeFilesystem?.routeString ?? null
      }
      return [pageConfig.pageId, page]
    })
  )

  return { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig, pageConfigsUserFriendly }
}

function getAllPageIds(pageFilesAll: PageFile[], pageConfigs: PageConfigRuntime[]): string[] {
  const fileIds = pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)
  const allPageIds2 = pageConfigs.map((p) => p.pageId)
  return [...allPageIds, ...allPageIds2]
}
