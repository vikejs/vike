import React from 'react'
import { escapeInject, pipeNodeStream } from 'vite-plugin-ssr'
// @ts-expect-error
import { renderToPipeableStream } from 'react-dom/server'
import { PageLayout } from './PageLayout'
import { getSsrDataBuffer, SsrDataProvider } from './useSsrData'
//import { ErrorBoundary } from 'react-error-boundary'
import { Writable } from 'stream'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  /*
    <ErrorBoundary FallbackComponent={Error}>
    </ErrorBoundary>,
   * */
  const stream: any = await renderToStream(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${pipeNodeStream(stream)}</div>
      </body>
    </html>`
}

function renderToStream(element: React.ReactNode) {
  let reject
  let resolve
  let resolved = false
  const promise = new Promise((resolve_, reject_) => {
    resolve = () => {
      if (resolved) return
      resolved = true
      resolve_(pipe)
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
  const seoStrategy: string = 'conservative'
  // const seoStrategy = 'speed'

  const onError = (err) => {
    reject(err)
  }

  let shellIsReady = false

  element = <SsrDataProvider>{element}</SsrDataProvider>

  let { pipe }: any = renderToPipeableStream(element, {
    bootstrapScriptContent: 'window.BOOT ? BOOT() : (window.LOADED = true)',
    //bootstrapScripts: ['bootstrap-chunk.js'],
    onAllReady() {
      resolve()
    },
    onShellReady() {
      console.log('shellIsReady')
      shellIsReady = true
      if (!isBot || seoStrategy === 'speed') {
        resolve()
      }
    },
    onShellError: onError,
    onError,
  })

  const onBeforeWrite = () => {
    if( !shellIsReady ) return null
    const htmlInjection = [getSsrDataBuffer(), ...injectionBuffer].filter(Boolean).join('')
    injectionBuffer.length = 0
    return htmlInjection
  }
  pipe = getPipeWrapper(pipe, onBeforeWrite)
  const injectionBuffer = pipe.injectionBuffer = []
  return promise
}

function getPipeWrapper(pipe: (writable: Writable) => void, onBeforeWrite: () => null | string) {
  const pipeWrapper = (writable: Writable) => {
    //const { Writable } = await loadStreamNodeModule()
    const writableProxy = new Writable({
      async write(chunk, ...rest) {
        console.log('write: ', String(chunk))
        const htmlInjection = onBeforeWrite()
        htmlInjection && writable.write(htmlInjection)
        //chunks.forEach((chunk) => writable.write(chunk))
        writable.write(chunk, ...rest)
      },
      async final(callback) {
        writable.end()
        callback()
      },
    })
    ;(writableProxy as any).flush = () => {
      if (typeof (writable as any).flush === 'function') {
        ;(writable as any).flush()
      }
    }
    pipe(writableProxy)
  }
  return pipeWrapper
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  )
}
