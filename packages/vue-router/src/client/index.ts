import { RouteMatch, PageRoute, setCustomRouter } from 'vite-plugin-ssr/route.shared';
import { createRouter, createWebHistory } from 'vue-router';

export { useVueRouter };

async function matchRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  const router = createRouter({
    routes: routes.map(route => ({ name: route.pageId, path: route.pageRoute as string, component: {} })),
    history: createWebHistory()
  });

  const resolved = router.resolve(url);

  if (resolved.matched && resolved.matched.length) {
    return {
      pageId: resolved.name as string,
      routeParams: resolved.params
    }
  }

  return null;
}

function sortRoutes() {
  return 1;
}

function useVueRouter() {
  setCustomRouter({ matchRoutes, sortRoutes })
} 
