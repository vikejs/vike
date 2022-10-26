export { render }
export { passToClient }
import { renderToStream } from 'react-streaming/server'
import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  let pageHtml
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    // SSR / HTML-only
    const { Page, pageProps } = pageContext
    pageHtml = await renderToStream(
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>,
      // We don't need streaming for a pre-rendered app.
      // (We still use react-streaming to enable <Suspsense>.)
      { disable: true }
    )
  }

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-container">${pageHtml}</div>
      </body>
    </html>`
}
