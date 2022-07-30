import { getPageFilesClientSide, getExports, PageFile } from '../shared/getPageFiles'

export { loadPageFilesClientSide }
export { isErrorFetchingStaticAssets }

const fetchErr = 'Cannot fetch static assets'

async function loadPageFilesClientSide(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  try {
    await Promise.all(pageFilesClientSide.map((p) => p.loadFile?.()))
  } catch (err: any) {
    throw new Error(fetchErr)
  }
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide)
  const pageContextAddendum = {
    exports,
    exportsAll,
    pageExports,
    _pageFilesLoaded: pageFilesClientSide,
  }
  return pageContextAddendum
}

function isErrorFetchingStaticAssets(err: unknown) {
  return (err as any)?.message === 'Cannot fetch static assets'
}
