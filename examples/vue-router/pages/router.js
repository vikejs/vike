import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router'

export { createRouter }

function createRouter() {
  return _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: '/',
        component: () => import('./Home.vue'),
      },
      {
        path: '/about',
        component: () => import('./About.vue'),
      },
    ],
  })
}
