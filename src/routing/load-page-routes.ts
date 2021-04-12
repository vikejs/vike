import { getPageFiles } from '../page-files/getPageFiles.shared'
import { PageId, PageRoute } from './types';
import { computePageId } from './compute-page-id'; 
import { assertUsage, hasProp, isCallable } from '../utils';

export async function loadPageRoutes(): Promise<Record<PageId, PageRoute>> {
  const userRouteFiles = await getPageFiles('.page.route')

  const pageRoutes: Record<PageId, PageRoute> = {}

  await Promise.all(
    userRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertUsage(hasProp(fileExports, 'default'), `${filePath} should have a default export.`)
      assertUsage(
        typeof fileExports.default === 'string' || isCallable(fileExports.default),
        `The default export of ${filePath} should be a string or a function.`
      )
      const pageRoute = fileExports.default
      const id = computePageId(filePath)
      const pageRouteFile = filePath

      pageRoutes[id] = { pageRoute, pageRouteFile, id }
    })
  )

  return pageRoutes
}