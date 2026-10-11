export { onRenderHtml }

import type { Writable } from 'node:stream'
import { escapeInject, stampPipe } from 'vike/server'

// A Node.js stream pipe, as vike-react's onRenderHtml() provides on Node.js
function onRenderHtml() {
  const pipe = (writable: Writable) => {
    writable.write('<p>Rendered by a Node.js stream.</p>')
    writable.end()
  }
  stampPipe(pipe, 'node-stream')
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>${pipe}</body>
    </html>`
}
