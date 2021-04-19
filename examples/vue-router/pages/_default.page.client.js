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
      const contextPropsByPath = reactive({});
      let currentRoutesPath = null;
      const router = app.config.globalProperties.$router;

      router.beforeResolve(async (to, from) => {
        if (currentRoutesPath !== to.fullPath) {
          const contextProps = contextPropsByPath[to.fullPath] || await getContextProps(to.fullPath);

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
  });

  await router.isReady()

  app.mount('#app')
}
