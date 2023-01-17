import { getPageFilesClientSide, getExports, type PageFile, type PageContextExports } from '../shared/getPageFiles'
import { findPageConfig } from '../shared/page-configs/findPageConfig'
import { loadPageCode } from '../shared/page-configs/loadPageCode'
import type { PageConfig2, PageConfigLoaded } from '../shared/page-configs/PageConfig'

export { loadPageFilesClientSide }
export { isErrorFetchingStaticAssets }

const stamp = '__whileFetchingAssets'

async function loadPageFilesClientSide(
  pageFilesAll: PageFile[],
  pageConfigs: PageConfig2[],
  pageId: string
): Promise<PageContextExports & { _pageFilesLoaded: PageFile[] }> {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  const pageConfig = findPageConfig(pageConfigs, pageId)
  let pageConfigLoaded: null | PageConfigLoaded
  try {
    // prettier-ignore
    const result = await Promise.all([
      pageConfig && loadPageCode(pageConfig),
      ...pageFilesClientSide.map((p) => p.loadFile?.()),
    ])
    pageConfigLoaded = result[0]
  } catch (err: any) {
    if (err) {
      Object.assign(err, { [stamp]: true })
    }
    throw err
  }
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide, pageConfigLoaded)
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
