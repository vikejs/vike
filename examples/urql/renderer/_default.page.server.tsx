import ReactDOMServer from 'react-dom/server'
import { createClient, ssrExchange, dedupExchange, cacheExchange, fetchExchange, Provider } from 'urql'
import prepass from 'react-ssr-prepass'
import React from 'react'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContext } from './types'
import type { PageContextBuiltInServer } from 'vike/types'
import 'isomorphic-fetch'

// See https://vike.dev/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'urqlState']

export async function render(pageContext: PageContextBuiltInServer & PageContext) {
  const { pageHtml } = pageContext

  // See https://vike.dev/head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'App using Vite + vike'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

export async function onBeforeRender(pageContext: PageContextBuiltInServer & PageContext) {
  const { Page, pageProps } = pageContext

  const ssr = ssrExchange({ initialState: undefined })
  const client = createClient({
    url: 'https://countries.trevorblades.com',
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
    suspense: true,
    fetch
  })

  // This is the first pass, due to suspense: true it will work with prepass and populate the initial cache
  await prepass(
    <Provider value={client}>
      <Page {...pageProps} />
    </Provider>
  )
  // After we can construct an initial html with renderToString as our cache is hydrated
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Provider value={client}>
        <Page {...pageProps} />
      </Provider>
    </PageShell>
  )

  const urqlState = ssr.extractData()

  return {
    pageContext: {
      pageHtml,
      urqlState
    }
  }
}
