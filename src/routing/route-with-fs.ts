import { normalizeUrl } from './normalize-url';
import { getFilesystemRoute } from './get-fs-route';
import { PageId } from './types';

export function routeWith_filesystem(urlPathname: string, pageId: string, allPageIds: PageId[]): boolean {
  const pageRoute = getFilesystemRoute(pageId, allPageIds)
  urlPathname = normalizeUrl(urlPathname)
  // console.log('[Route Candidate] url:' + urlPathname, 'pageRoute:' + pageRoute)
  const matchValue = urlPathname === pageRoute
  return matchValue
}