export { onCreatePageContext }

import type { PageContextServer } from '../../renderer/types'

function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.errorDescription = pageContext.is404 ? 'Page not found.' : 'Something went wrong.'
}
