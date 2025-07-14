export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

async function onCreatePageContext(pageContext: PageContextServer) {
  if (pageContext.urlParsed.pathname === '/about') {
    pageContext.headersResponse = [['Some-Header', 'Some-Header-Value']]
  }
}
