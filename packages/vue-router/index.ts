import { RouteMatch, PageRoute } from 'vite-plugin-ssr/route.shared';
import { createRouter, createMemoryHistory } from 'vue-router';

export  { useVueRouter };

async function matchRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  routes.forEach(route => {
    if (typeof route.pageRoute !== 'string') {
      throw new Error(`When using Vue Router integration, route functions must return Vue Router paths, not objects.`);
    }
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

const useVueRouter = { matchRoutes }