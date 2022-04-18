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
      resolve_(wrapper.pipeWrapper)
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

  element = <SsrDataProvider>{element}</SsrDataProvider>

  let { pipe }: any = renderToPipeableStream(element, {
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

  const onBeforeWrite = () => {
    const chunks: string[] = []
    chunks.push(getSsrDataBuffer(), ...injectionBuffer)
    const htmlInjection = chunks.filter(Boolean).join('')
    injectionBuffer.length = 0
    return htmlInjection
  }
  const wrapper = getPipeWrapper(pipe, (write, chunk) => {
    // console.log('write [react]')
    const htmlInjection = onBeforeWrite()
    // console.log('htmlInjection: ',htmlInjection)
    htmlInjection && write(htmlInjection)
    write(chunk)
  })
  const injectionBuffer = []
  ;(wrapper.pipeWrapper as any).injectHtml = (htmlChunk: string) => {
    wrapper.pipeWrite(htmlChunk)
  }
  return promise
}

function getPipeWrapper(
  pipe: (writable: Writable) => void,
  onWrite: (write: (chunkMod: string) => void, chunk: string) => void,
) {
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
    wrapper.pipeWrite = (chunk: string) => {
      onWrite((chunk: string) => { writableProxy.write(chunk) }, chunk)
    }
    ;(writableProxy as any).flush = () => {
      if (typeof (writable as any).flush === 'function') {
        ;(writable as any).flush()
      }
    }
    pipe(writableProxy)
  }
  const wrapper: {
    pipeWrapper: (writable: Writable) => void
    pipeWrite: null | ((_chunk: string) => void)
  } = {
    pipeWrapper,
    pipeWrite: null,
  }
  return wrapper
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  )
}
