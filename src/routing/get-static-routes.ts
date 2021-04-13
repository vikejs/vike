import { sortRoutes } from './sort-routes';
import { PageRoute, PageId } from './types';
import { isCallable } from '../utils';
import { getFilesystemRoute } from './get-fs-route';
import { isErrorPage } from './is-error-page';

export function getStaticRoutes(routes: PageRoute[], pageIds: PageId[]) {

  const implicitRoutes : PageRoute[] = pageIds
    .filter(pageId => !routes.some(route => route.id === pageId) && !isErrorPage(pageId))
    .map(id => ({ pageRoute: getFilesystemRoute(id, pageIds), id }));

  const nonFunctionalRoutes = Object.values(routes)
    .filter(route => !isCallable(route.pageRoute));

  return [
    ...implicitRoutes,
    ...nonFunctionalRoutes
  ].sort(sortRoutes)
}
