import { getContextProps, getPageById, loadPageRoutes, getPageIds, getRouteStrings } from 'vite-plugin-ssr/client/router'
import { reactive, App } from 'vue';
import { Router } from 'vue-router';

type ContextProps = Record<string, unknown> & { routes?: {id: string, pageRoute: string}[] }

export function vitePluginSsrRoutes(config={}) {
  return {
    install(app: App) {
      const contextPropsByPath : Record<string, ContextProps> = reactive({});
      let currentRoutesPath : string|null = null;
      const router : Router = app.config.globalProperties.$router;

      router.beforeResolve(async (to, from) => {
        const [ pageIds, pageRoutes ] = await Promise.all([ getPageIds(), loadPageRoutes() ]);

        const routes = getRouteStrings(Object.values(pageRoutes), pageIds);

        debugger;
        if (currentRoutesPath !== to.fullPath) {
          const contextProps : ContextProps = contextPropsByPath[to.fullPath] || await getContextProps(to.fullPath);


          if (!contextProps.routes) {
            throw new Error('Context props do not include routes.');
          }
          contextProps.routes.forEach(route => {
            router.addRoute({
              name: route.id,
              path: route.pageRoute,
              meta: {
                isViteSsrPageRoute: true
              },
              props: (route) => contextPropsByPath[route.fullPath],
              component: async () => getPageById(route.id)
            })
          });

          contextPropsByPath[to.fullPath] = contextProps;
          currentRoutesPath = to.fullPath;

          return to.fullPath;
        }

        if (to.meta.isViteSsrPageRoute && !contextPropsByPath[to.fullPath]) {
          const contextProps = await getContextProps(to.fullPath);

          contextPropsByPath[to.fullPath] = contextProps;

          return to.fullPath;
        }
      });
    },
  }
}