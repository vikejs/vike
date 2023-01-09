import { getPageFilesClientSide, getExports, type PageFile, type PageContextExports } from '../shared/getPageFiles'
import { findPageConfig, PageConfig } from '../shared/getPageFiles/getPageConfigsFromGlob'

export { loadPageFilesClientSide }
export { isErrorFetchingStaticAssets }

const stamp = '__whileFetchingAssets'

async function loadPageFilesClientSide(
  pageFilesAll: PageFile[],
  pageConfigs: PageConfig[],
  pageId: string
): Promise<PageContextExports & { _pageFilesLoaded: PageFile[] }> {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  const pageConfig = findPageConfig(pageConfigs, pageId)
  try {
    // prettier-ignore
    await Promise.all([
      ...pageFilesClientSide.map((p) => p.loadFile?.()),
      pageConfig.loadCode()
    ])
  } catch (err: any) {
    if (err) {
      Object.assign(err, { [stamp]: true })
    }
    throw err
  }
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide, pageConfig)
  const pageContextAddendum = {
    exports,
    exportsAll,
    pageExports,
    _pageFilesLoaded: pageFilesClientSide
  }
  return pageContextAddendum
}

function isErrorFetchingStaticAssets(err: unknown) {
  if (!err) {
    return false
  }
  return (err as any)[stamp] === true
}
