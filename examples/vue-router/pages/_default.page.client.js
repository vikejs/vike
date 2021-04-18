import { getContextProps, getPageById } from 'vite-plugin-ssr/client/router'
import { createApp } from './app'
import { createRouter, createWebHistory } from 'vue-router'
import { reactive } from 'vue';

hydrate()

async function hydrate() {

  const app = createApp({});
  const router = createRouter({
    history: createWebHistory(),
    routes: [], //Routes are added dynamically below
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 };
    },
  });

  app.use(router);
  app.use({
    install(app) {
      const pagePropsByPath = reactive({});
      let currentRoutesPath = null;
      const router = app.config.globalProperties.$router;

      router.beforeResolve(async (to, from) => {
        if (currentRoutesPath !== to.fullPath) {
          const pageProps = pagePropsByPath[to.fullPath] || await getContextProps(to.fullPath);
          
          pageProps.routes.forEach(route => {
            router.addRoute({
              name: route.id,
              path: route.pageRoute,
              meta: {
                isViteSsrPageRoute: true
              },
              props: (route) => pagePropsByPath[route.fullPath],
              component: async () => getPageById(route.id)
            })
          });

          pagePropsByPath[to.fullPath] = pageProps;
          currentRoutesPath = to.fullPath;

          return to.fullPath;
        }

        if (to.meta.isViteSsrPageRoute && !pagePropsByPath[to.fullPath]) {
          const pageProps = await getContextProps(to.fullPath);

          pagePropsByPath[to.fullPath] = pageProps;

          return to.fullPath;
        }
      });
    },
  });

  await router.isReady()

  app.mount('#app')
}
