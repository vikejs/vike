import { App, Component } from 'vue';
import { Router } from 'vue-router';
import { getRoutes } from '../isomorphic/get-routes';

type PageContext = Record<string, unknown> & { urlPathname: string, routes?: {pageId: string, pageRoute: string}[] } & {
  Page: Component
};

export function vitePluginSsrRoutes(pageContext: PageContext) {
  return {
    install(app: App) {
      const { Page } = pageContext;

      if (!pageContext) {
        throw new Error('vitePluginSsrRoutes plugin must be passed pageContext at initialization when used on the server.');
      }

      if (!Page) {
        throw new Error('vitePluginSsrRoutes plugin must be passed Page component at initialization when used on the server.');
      }

      const pageContextByPath = {
        [pageContext.urlPathname]: pageContext
      };

      const router : Router = app.config.globalProperties.$router;
      let initRoutesPromise : Promise<void>;

      async function initRoutes() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const routes = await getRoutes();

        routes.forEach(route => {
          router.addRoute({
            name: route.pageId,
            path: route.pageRoute as string,
            meta: {
              isViteSsrPageRoute: true
            },
            props: (route) => pageContextByPath[route.fullPath],
            component: Page
          })
        })
      }

      router.beforeEach(async (to, from) => {
        if (!initRoutesPromise) {
          await (initRoutesPromise = initRoutes())
          return to.fullPath;
        }
        if (to.fullPath !== pageContext.urlPathname) {
          throw new Error(`Vue SSR process expected to route to ${pageContext.urlPathname} but was routed to ${to.fullPath}`)
        }
      });
    }
  }
}
