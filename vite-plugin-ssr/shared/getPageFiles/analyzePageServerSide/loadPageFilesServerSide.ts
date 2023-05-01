export { loadPageFilesServerSide }

import { getPageFilesServerSide } from '../getAllPageIdFiles'
import { getExports } from '../getExports'
import type { PageFile } from '../getPageFileObject'
import type { PlusConfig } from '../../page-configs/PlusConfig'
import { loadPageCode } from '../../page-configs/loadPageCode'

async function loadPageFilesServerSide(
  pageFilesAll: PageFile[],
  plusConfig: null | PlusConfig,
  pageId: string,
  isDev: boolean
) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const plusConfigLoaded = !plusConfig ? null : await loadPageCode(plusConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { config, configEntries, exports, exportsAll, pageExports } = getExports(pageFilesServerSide, plusConfigLoaded)
  return {
    config,
    configEntries,
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide,
    plusConfigLoaded
  }
}
