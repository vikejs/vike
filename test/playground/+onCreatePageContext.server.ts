export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

async function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.headersResponse = [['X-Powered-By', 'somePoweredByValue']]
}
