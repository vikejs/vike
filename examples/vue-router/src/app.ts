/*
 * @Descripttion: ./routertjs
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-10 17:36:10
 */
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import painia from './stores'
import type { PageContext } from '../src/entity/types'

function createApp(pageContext: PageContext) {
  const app = createSSRApp(pageContext.Page)
  const router = createRouter()
  app.use(router)
  app.use(painia)
  
  return { app, router }
}

export { createApp }