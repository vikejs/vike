/*
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-09 17:34:26
 */
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
        component: () => import('../views/Home.vue')
      },
      {
        path: '/about',
        component: () => import('../views/About.vue')
      }
    ]
  })
}
