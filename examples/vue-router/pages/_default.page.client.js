import { createApp } from './app'
import { createRouter, createWebHistory } from 'vue-router'
import { viteSsrRoutes } from '@vite-plugin-ssr/vue-router/client/plugin';

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
  app.use(viteSsrRoutes());

  await router.isReady()

  app.mount('#app')
}
