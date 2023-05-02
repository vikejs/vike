export { loadPageFilesServerSide }

import { getPageFilesServerSide } from '../getAllPageIdFiles'
import { getExports } from '../getExports'
import type { PageFile } from '../getPageFileObject'
import type { PageConfig } from '../../page-configs/PageConfig'
import { loadPageCode } from '../../page-configs/loadPageCode'

async function loadPageFilesServerSide(
  pageFilesAll: PageFile[],
  pageConfig: null | PageConfig,
  pageId: string,
  isDev: boolean
) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfigLoaded = !pageConfig ? null : await loadPageCode(pageConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { config, configEntries, exports, exportsAll, pageExports } = getExports(pageFilesServerSide, pageConfigLoaded)
  return {
    config,
    configEntries,
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide,
    pageConfigLoaded
  }
}
