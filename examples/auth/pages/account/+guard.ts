export default guard

import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'

function guard(pageContext: PageContext) {
  if (!pageContext.user) {
    throw render('/login')
  }
}
