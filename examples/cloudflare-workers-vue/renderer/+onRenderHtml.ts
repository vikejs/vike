// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { pipeToWebWritable, pipeToNodeWritable } from '@vue/server-renderer'

import { escapeInject, stampPipe } from 'vike/server'
import { createVueApp } from './createVueApp'
import type { OnRenderHtmlAsync } from 'vike/types'
import type { Writable } from 'stream'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const app = createVueApp(pageContext)

  // Streaming is optional: we can use renderToString() instead.
  const pipe = isWorker()
    ? (writable: WritableStream) => {
        pipeToWebWritable(app, {}, writable)
      }
    : // While developing, we use Vite's development sever instead of a Cloudflare worker. Instead of `pipeToNodeWritable()`, we could as well use `renderToString()`.
      (writable: Writable) => {
        pipeToNodeWritable(app, {}, writable)
      }
  stampPipe(pipe, isWorker() ? 'web-stream' : 'node-stream')

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${pipe}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  }
}

// https://github.com/cloudflare/wrangler2/issues/1481
// https://community.cloudflare.com/t/how-to-detect-the-cloudflare-worker-runtime/293715
function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' || typeof caches !== 'undefined'
  )
}
