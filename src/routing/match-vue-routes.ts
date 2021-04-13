import { RouteMatch, PageRoute } from './types';

import { createRouter, createMemoryHistory } from 'vue-router';
import { assertUsage } from '../utils';

export async function matchRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  routes.forEach(route => {
    assertUsage(route.pageRoute.constructor !== Object, `When using Vue Router integration, functional page routes must return Vue Router paths, not objects.`);
  })

  const router = createRouter({
    routes: routes.map(route => ({ name: route.id, path: route.pageRoute as string, component: {} })),
    history: createMemoryHistory()
  });
  
  await router.push(url);
  await router.isReady();

  if (router.currentRoute.value.matched && router.currentRoute.value.matched.length) {
    return {
      pageId: router.currentRoute.value.name as string,
      routeParams: router.currentRoute.value.params
    }
  }

  return null;
}