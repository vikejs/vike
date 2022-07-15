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

  // While developing, we use Express.js instead of Cloudflare Workers.
  const pipe = isWorker()
    ? (writable: WritableStream) => {
        pipeToWebWritable(app, {}, writable)
      }
    : // We don't really need to use a stream for dev, but we do it for fun's sake :-).
      // For real apps, we should use `renderToString` instead of `pipeToNodeWritable` in dev.
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
