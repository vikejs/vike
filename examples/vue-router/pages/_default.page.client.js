import { createApp } from './app'
import { createRouter, createWebHistory } from 'vue-router'
import { vitePluginSsrRoutes } from '@vite-plugin-ssr/vue-router/client/plugin';
import { useVueRouter } from '@vite-plugin-ssr/vue-router/client';

useVueRouter()

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
  app.use(vitePluginSsrRoutes());

  await router.isReady()

  app.mount('#app')
}
