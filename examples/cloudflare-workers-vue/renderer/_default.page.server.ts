import { pipeToWebWritable, pipeToNodeWritable } from '@vue/server-renderer'

import { escapeInject, stampStreamPipe } from 'vite-plugin-ssr'
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
  stampStreamPipe(pipe, { pipeType: isWorker() ? 'web' : 'node' })

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${pipe}</div>
      </body>
    </html>`
}
function isWorker() {
  return (
    // `IS_CLOUDFLARE_WORKER` is set by `build-worker`
    // @ts-ignore
    typeof IS_CLOUDFLARE_WORKER !== 'undefined' && IS_CLOUDFLARE_WORKER === true
  )
}
