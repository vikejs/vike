/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-11 10:43:40
 */


import { createApp } from '../app'
import type { PageContext } from '../entity/types'
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types'

const render = async (pageContext: PageContextBuiltInClient & PageContext) => {
  const { app, router } = createApp(pageContext)
  await router.isReady()
  app.mount('#app')
}

export { render }