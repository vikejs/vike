/*
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-10 16:25:23
 */
import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr/server'
import { createApp } from '../app'
import type { PageContext } from '../entity/types'
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types'

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { app, router } = createApp(pageContext)

  // set the router to the desired URL before rendering
  router.push(pageContext.urlOriginal)
  await router.isReady()

  const stream = renderToNodeStream(app)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>标题待定</title>
      </head>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  }
}

export { render }