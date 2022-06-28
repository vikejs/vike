import { getPageFilesClientSide, getExports, PageFile } from '../shared/getPageFiles'

export { loadPageFilesClientSide }

async function loadPageFilesClientSide(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  try {
    await Promise.all(pageFilesClientSide.map((p) => p.loadFile?.()))
  } catch (err: any) {
    return {
      errorFetchingStaticAssets: true,
      err,
    }
  }
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide)
  return {
    pageContextAddendum: {
      exports,
      exportsAll,
      pageExports,
      pageFilesLoaded: pageFilesClientSide,
    },
  }
}
