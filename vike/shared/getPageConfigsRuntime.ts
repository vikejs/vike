export { getPageConfigsRuntime }
export { getAllPageIds }

import { PageFile } from './getPageFiles.js'
import { parseGlobResults } from './getPageFiles/parseGlobResults.js'
import { PageConfigRuntime } from './page-configs/PageConfig.js'
import { unique } from './utils.js'

function getPageConfigsRuntime(virtualFileExports: unknown) {
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseGlobResults(virtualFileExports)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)
  return { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal }
}

function getAllPageIds(pageFilesAll: PageFile[], pageConfigs: PageConfigRuntime[]): string[] {
  const fileIds = pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)
  const allPageIds2 = pageConfigs.map((p) => p.pageId)
  return [...allPageIds, ...allPageIds2]
}
