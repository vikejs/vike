/*
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-09 17:25:26
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-11 10:44:22
 */
import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr/server'
import { createApp } from '../app'
import type { PageContext } from '../entity/types'
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types'

const render = async (pageContext: PageContextBuiltInClient & PageContext) => {
  const { app, router } = createApp(pageContext)

  // set the router to the desired URL before rendering
  router.push(pageContext.urlOriginal)
  await router.isReady()

  const appHtml = renderToNodeStream(app)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${appHtml}</div>
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