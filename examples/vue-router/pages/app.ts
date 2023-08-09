/*
 * @Descripttion: ./routertjs
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-09 17:29:21
 */
import { createSSRApp } from 'vue'
import { createRouter } from './router'

export { createApp }

function createApp({ Page }) {
  const app = createSSRApp(Page)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
