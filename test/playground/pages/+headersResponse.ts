export { headersResponse }

import type { PageContextServer } from 'vike/types'

async function headersResponse(pageContext: PageContextServer) {
  return {
    'some-dynamic-header': `the-page-url=${pageContext.urlPathname}`,
  }
}
