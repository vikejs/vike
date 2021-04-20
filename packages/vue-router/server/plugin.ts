import { App, Component } from 'vue';
import { Router } from 'vue-router';

type ContextProps = Record<string, unknown> & { url: string, routes?: {id: string, pageRoute: string}[] }

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

      if (!contextProps.routes) {
        throw new Error('contextProps passed to vitePluginSsrRoutes must contain routes.');
      }

      const contextPropsByPath = {
        [contextProps.url]: contextProps
      };

      const router : Router = app.config.globalProperties.$router;

      router.beforeEach((to, from) => {
        if (to.fullPath !== contextProps.url) {
          throw new Error(`Vue SSR process expected to route to ${contextProps.url} but was routed to ${to.fullPath}`)
        }
      });
      
      contextProps.routes.forEach(route => {
        router.addRoute({
          name: route.id,
          path: route.pageRoute,
          meta: {
            isViteSsrPageRoute: true
          },
          props: (route) => contextPropsByPath[route.fullPath],
          component: Page
        })
      })
    }
  }
}
