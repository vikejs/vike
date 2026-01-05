export { forkPageContext }

import { objectAssign } from '../../utils/objectAssign.js'

// Create pageContext forks to avoid leaks: upon an error (bug or abort) a brand new pageContext object is created, in order to avoid previous pageContext modifications that are now obsolete to leak to the new pageContext object.
function forkPageContext<PageContext extends Record<string, unknown>>(pageContext: PageContext) {
  const pageContextNew = {}
  objectAssign(pageContextNew, pageContext, true)
  return pageContextNew
}
