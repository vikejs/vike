import { App, Component } from 'vue';
import { Router } from 'vue-router';
import { getRoutes } from '../isomorphic/get-routes';

type ContextProps = Record<string, unknown> & { urlPathname: string, routes?: {id: string, pageRoute: string}[] }

type Config = { 
  contextProps: ContextProps,
  Page: Component
};

export function vitePluginSsrRoutes(config: Config) {
  return {
    install(app: App) {
      const { contextProps, Page } = config;

      if (!contextProps) {
        throw new Error('vitePluginSsrRoutes plugin must be passed contextProps at initialization when used on the server.');
      }

      if (!Page) {
        throw new Error('vitePluginSsrRoutes plugin must be passed Page component at initialization when used on the server.');
      }

      const contextPropsByPath = {
        [contextProps.urlPathname]: contextProps
      };

      const router : Router = app.config.globalProperties.$router;
      let initRoutesPromise : Promise<void>;

      async function initRoutes() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const routes = await getRoutes();

        routes.forEach(route => {
          router.addRoute({
            name: route.id,
            path: route.pageRoute as string,
            meta: {
              isViteSsrPageRoute: true
            },
            props: (route) => contextPropsByPath[route.fullPath],
            component: Page
          })
        })
      }

      router.beforeEach(async (to, from) => {
        if (!initRoutesPromise) {
          await (initRoutesPromise = initRoutes())
          return to.fullPath;
        }
        if (to.fullPath !== contextProps.urlPathname) {
          throw new Error(`Vue SSR process expected to route to ${contextProps.urlPathname} but was routed to ${to.fullPath}`)
        }
      });
    }
  }
}
