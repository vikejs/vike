export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { createClient, ssrExchange, dedupExchange, cacheExchange, fetchExchange, Provider } from 'urql'
import { PageShell } from './PageShell'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps, urqlState } = pageContext
  const client = createClient({
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    exchanges: [
      dedupExchange,
      cacheExchange,
      // We hydrate the page
      ssrExchange({ isClient: true, initialState: urqlState }),
      fetchExchange,
    ],
  })
  ReactDOM.hydrate(
    <PageShell pageContext={pageContext}>
      <Provider value={client}>
        <Page {...pageProps} />
      </Provider>
    </PageShell>,
    document.getElementById('page-view'),
  )
}
