import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, pipeNodeStream } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'
import { SsrDataProvider } from './useSsrData'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const stream = await renderToStream(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
  )

  console.log('stream promise resolved')

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${pipeNodeStream(stream)}</div>
      </body>
    </html>`
}

function renderToStream(element) {
  let reject
  let resolve
  let resolved = false
  const promise = new Promise((resolve_, reject_) => {
    resolve = () => {
      if (resolved) return
      resolved = true
      resolve_(streamReact.pipe)
    }
    reject = (err) => {
      if (resolved) return
      resolved = true
      reject_(err)
    }
  })

  // https://github.com/omrilotan/isbot
  // https://github.com/mahovich/isbot-fast
  // https://stackoverflow.com/questions/34647657/how-to-detect-web-crawlers-for-seo-using-express/68869738#68869738
  const isBot = false
  const seoStrategy = 'conservative'

  // const seoStrategy = 'speed'
  const onError = (err) => {
    reject(err)
  }

  element = <SsrDataProvider>{element}</SsrDataProvider>

  const streamReact = ReactDOMServer.renderToPipeableStream(element, {
    bootstrapScriptContent: 'window.BOOT ? BOOT() : (window.LOADED = true)',
    //bootstrapScripts: ['bootstrap-chunk.js'],
    onAllReady() {
      resolve()
    },
    onShellReady() {
      if (!isBot || seoStrategy === 'speed') {
        resolve()
      }
    },
    onShellError: onError,
    onError,
  })
  return promise
}
