import { getPageFilesClientSide, getExports, type PageFile, type PageContextExports } from '../shared/getPageFiles'

export { loadPageFilesClientSide }
export { isErrorFetchingStaticAssets }

const stamp = '__whileFetchingAssets'

async function loadPageFilesClientSide(
  pageFilesAll: PageFile[],
  pageId: string
): Promise<PageContextExports & { _pageFilesLoaded: PageFile[] }> {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  try {
    await Promise.all(pageFilesClientSide.map((p) => p.loadFile?.()))
  } catch (err: any) {
    if (err) {
      Object.assign(err, { [stamp]: true })
    }
    throw err
  }
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide)
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
