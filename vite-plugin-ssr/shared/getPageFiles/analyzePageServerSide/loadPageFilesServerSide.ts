export { loadPageFilesServerSide }

import { getPageFilesServerSide } from '../getAllPageIdFiles'
import { getExports } from '../getExports'
import { findPageConfig, PageConfig } from '../getPageConfigsFromGlob'
import type { PageFile } from '../getPageFileObject'

async function loadPageFilesServerSide(pageFilesAll: PageFile[], pageConfigs: PageConfig[], pageId: string) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfig = findPageConfig(pageConfigs, pageId)
  await Promise.all([...pageFilesServerSide.map((p) => p.loadFile?.()), pageConfig?.loadCode()])
  const { exports, exportsAll, pageExports } = getExports(pageFilesServerSide, pageConfig)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide
  }
}
