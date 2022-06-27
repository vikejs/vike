export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createClient, ssrExchange, dedupExchange, cacheExchange, fetchExchange, Provider } from 'urql'
import { PageShell } from './PageShell'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps, urqlState } = pageContext
  const client = createClient({
    url: 'https://countries.trevorblades.com',
    exchanges: [
      dedupExchange,
      cacheExchange,
      // We hydrate the page
      ssrExchange({ isClient: true, initialState: urqlState }),
      fetchExchange,
    ],
  })
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageShell pageContext={pageContext}>
      <Provider value={client}>
        <Page {...pageProps} />
      </Provider>
    </PageShell>,
  )
}
