export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

// Verify that pageContext.req and pageContext.res are aliases of pageContext.runtime.req and pageContext.runtime.res.
// https://vike.dev/pageContext#req
function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.headersResponse.set('test-pagecontext-req-alias', String(pageContext.req === pageContext.runtime.req))
  pageContext.headersResponse.set('test-pagecontext-res-alias', String(pageContext.res === pageContext.runtime.res))
}
