/*
 * @Descripttion: ./routertjs
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-09 17:34:59
 */
import { createSSRApp } from 'vue'
import { createRouter } from './routers/router'
import type { PageContext } from '../src/entity/types'

function createApp(pageContext: PageContext) {
  const app = createSSRApp(pageContext.Page)
  const router = createRouter()
  app.use(router)
  return { app, router }
}


export { createApp }