import { RouteMatch, PageRoute, setCustomRouter } from 'vite-plugin-ssr/route.shared';
import { createRouter, createMemoryHistory } from 'vue-router';

export  { useVueRouter };

async function matchRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  const router = createRouter({
    routes: routes.map(route => ({ name: route.pageId, path: route.pageRoute as string, component: {} })),
    history: createMemoryHistory()
  });

  const resolved = router.resolve(url);

  if (resolved.matched && resolved.matched.length) {
    const routeParams = Object.fromEntries(
      Object.entries(resolved.params)
        .map(([k,v]) => {
          if (Array.isArray(v)) {
            console.warn(`Vue router param ${k} has multiple values. This is not supported by vite-plugin-ssr`);
            return [k,v[0]]
          }
          return [k,v]
        })
    );
    return {
      pageId: resolved.name as string,
      routeParams
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
