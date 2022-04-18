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
      resolve_(pipeWrapper)
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

  const __SHELL_DELIMITER = '__SHELL_DELIMITER'

  let { pipe }: any = renderToPipeableStream(element, {
    bootstrapScriptContent: '__SHELL_DELIMITER',
    //bootstrapScripts: ['bootstrap-chunk.js'],
    onAllReady() {
      resolve()
    },
    onShellReady() {
      console.log('onShellReady')
      shellIsReady = true
      if (!isBot || seoStrategy === 'speed') {
        resolve()
      }
    },
    onShellError: onError,
    onError,
  })

  let beginAcc: null | string = ''
  let beginHtml: null | string = null
  const onBeforeWrite = () => {
    if (!shellIsReady) return null
    const chunks: string[] = []
    chunks.push(getSsrDataBuffer(), ...injectionBuffer)
    const htmlInjection = chunks.filter(Boolean).join('')
    injectionBuffer.length = 0
    return htmlInjection
  }
  const { pipeWrapper, pipeWrite } = getPipeWrapper(pipe, (write, chunk) => {
    console.log('write [react]')
      process.nextTick(() => {
        console.log('tick')
      })
    if (beginAcc !== null) {
      beginAcc += chunk
      const delimiter_token = `<script>${__SHELL_DELIMITER}</script>`
      if (beginAcc.includes(delimiter_token)) {
        beginAcc = beginAcc.replace(delimiter_token, '')
        beginHtml = beginAcc
        beginAcc = null
      }
      write('')
      return
    }
    if( beginHtml ){
      write(beginHtml)
      beginHtml = null
    }
    const htmlInjection = onBeforeWrite()
    // console.log('htmlInjection: ',htmlInjection)
    htmlInjection && write(htmlInjection)
    write(chunk)
  })
  const injectionBuffer = [];
  (pipeWrapper as any).injectHtml = (htmlChunk: string) => {
    injectionBuffer.push(htmlChunk)
    pipeWrite('')
  }
  return promise
}

function getPipeWrapper(
  pipe: (writable: Writable) => void,
  onWrite: (write: (chunkMod: string) => void, chunk: string) => void,
) {
  let pipeWrite = (_chunk: string) => { }
  const pipeWrapper = (writable: Writable) => {
    console.log('pipe() call')
    //const { Writable } = await loadStreamNodeModule()
    const writableProxy = new Writable({
      write(chunk: unknown, _encoding, callback) {
        const write = (chunkMod: string) => {
          // console.log('write: '+chunkMod)
          writable.write(chunkMod)
        }
        onWrite(write, String(chunk))
        callback()
      },
      final(callback) {
        writable.end()
        callback()
      },
    })
    pipeWrite = (chunk: string) => {
      onWrite(writableProxy.write, chunk)
    }
    ;(writableProxy as any).flush = () => {
      if (typeof (writable as any).flush === 'function') {
        ;(writable as any).flush()
      }
    }
    pipe(writableProxy)
  }
  return { pipeWrapper, pipeWrite }
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  )
}
