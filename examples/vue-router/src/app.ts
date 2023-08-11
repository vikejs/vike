/*
 * @Descripttion: ./routertjs
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-11 11:00:25
 */
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import painia from './stores'
import type { PageContext } from '~/entity/types'


const createApp = (pageContext: PageContext) => {
  const app = createSSRApp(pageContext.Page)
  const router = createRouter()

  app.use(router)
  app.use(painia)

  return { app, router }
}

export { createApp }