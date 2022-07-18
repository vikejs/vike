import { pipeToWebWritable, pipeToNodeWritable } from '@vue/server-renderer'

import { escapeInject, stampPipe } from 'vite-plugin-ssr'
import { createApp } from './app'
import type { Writable } from 'stream'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext: any) {
  const app = createApp(pageContext)

  const pipe = isWorker()
    ? (writable: WritableStream) => {
        pipeToWebWritable(app, {}, writable)
      }
    : // While developing, we use Vite's development sever instead of a Cloudflare worker. Instead of `pipeToNodeWritable`, we could as well use `renderToString`.
      (writable: Writable) => {
        pipeToNodeWritable(app, {}, writable)
      }
  stampPipe(pipe, isWorker() ? 'web-stream' : 'node-stream')

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${pipe}</div>
      </body>
    </html>`
}

// https://github.com/cloudflare/wrangler2/issues/1481
// https://community.cloudflare.com/t/how-to-detect-the-cloudflare-worker-runtime/293715
function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' || typeof caches !== 'undefined'
  )
}
