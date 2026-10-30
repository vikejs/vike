export { onCreatePageContext }

import { render } from 'vike/abort'
import type { PageContextServer } from '../../renderer/types'

function onCreatePageContext(pageContext: PageContextServer) {
  // Like an auth check in a root +onCreatePageContext.server.ts, which also runs for the error page
  if (pageContext.urlPathname === '/render-401') throw render(401)
  pageContext.errorDescription = pageContext.is404 ? 'Page not found.' : 'Something went wrong.'
}
