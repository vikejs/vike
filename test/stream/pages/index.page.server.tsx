export { render }

import { renderToString, renderToPipeableStream, version } from 'react-dom/server'
// import { renderToStream } from 'react-streaming/server'
import { escapeInject, dangerouslySkipEscape, stampPipe } from 'vite-plugin-ssr'

console.log(`react-dom@${version}`)
console.log(`node@${process.version}`)

async function render(pageContext: { withStream: boolean }) {
  const Page = () => <p>Hello</p>
  const page = <Page />

  let pageHtml: any
  if (!pageContext.withStream) {
    pageHtml = dangerouslySkipEscape(renderToString(page))
  } else {
    //const stream = await renderToStream(page, { disable: true })
    const { pipe } = renderToPipeableStream(page, {
      onShellReady() {
        console.log('onShellReady()')
      },
      onAllReady() {
        console.log('onAllReady()')
      },
      onShellError(err: unknown) {
        console.log('onShellError()')
        console.log(err)
      },
      onError(err: unknown) {
        console.log('onError()')
        console.log(err)
      }
    })
    stampPipe(pipe, 'node-stream')
    pageHtml = pipe
  }

  return escapeInject`<html><head><meta charset="utf-8"></head><body><div>${pageHtml}</div></body></html>`
}
