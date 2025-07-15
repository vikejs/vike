export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

async function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.headersResponse.set('Some-Header', 'Some-Header-Value')
  if (pageContext.urlParsed.pathname === '/about') {
    pageContext.headersResponse.delete('sOMe-staTic-Header')
  }
  pageContext.globalContext.someClientProp = 'someValueSetOnce'
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      someClientProp: string
    }
  }
}
