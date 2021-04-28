import { getContextProps, getPageById } from 'vite-plugin-ssr/client/router'
import { reactive, App } from 'vue';
import { Router } from 'vue-router';
import { getRoutes } from '../isomorphic/get-routes';

type ContextProps = Record<string, unknown> & { routes?: {id: string, pageRoute: string}[] }

export function vitePluginSsrRoutes(config={}) {
  return {
    install(app: App) {
      const contextPropsByPath : Record<string, ContextProps> = reactive({});
      const router : Router = app.config.globalProperties.$router;

      let initRoutesPromise: Promise<void>;

      async function initRoutes() {
        const routes = await getRoutes();

        routes.forEach(route => {
          router.addRoute({
            name: route.id,
            path: route.pageRoute as string,
            meta: {
              isViteSsrPageRoute: true
            },
            props: (route) => contextPropsByPath[route.fullPath],
            component: async () => getPageById(route.id)
          })
        })
      }

      router.beforeResolve(async (to, from) => {
        if (!initRoutesPromise) {
          await (initRoutesPromise = initRoutes())
          return to.fullPath;
        }
        
        await initRoutesPromise

        if (to.meta.isViteSsrPageRoute && !contextPropsByPath[to.fullPath]) {
          const contextProps = await getContextProps(to.fullPath);

          contextPropsByPath[to.fullPath] = contextProps;

          return to.fullPath;
        }
      });
    },
  }
}