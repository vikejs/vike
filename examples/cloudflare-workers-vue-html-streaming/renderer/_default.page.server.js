import { pipeToWebWritable, pipeToNodeWritable } from '@vue/server-renderer'

import { escapeInject, pipeWebStream, pipeNodeStream } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createApp(pageContext)

  // While developing, we use Express.js instead of Cloudflare Workers.
  const pipe = isWorker()
    ? pipeWebStream((writable) => {
        pipeToWebWritable(app, {}, writable)
      })
    : // We don't really need to use a stream for dev, but we do it for fun's sake :-).
      // For real apps, we should use `renderToString` instead of `pipeToNodeWritable` in dev.
      pipeNodeStream((writable) => {
        pipeToNodeWritable(app, {}, writable)
      })

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${pipe}</div>
      </body>
    </html>`
}
function isWorker() {
  return (
    // `IS_CLOUDFLARE_WORKER` is set by `webpack.config.js`
    typeof IS_CLOUDFLARE_WORKER !== 'undefined' && IS_CLOUDFLARE_WORKER === true
  )
}
