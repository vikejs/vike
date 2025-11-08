// https://vike.dev/guard
export { guard }

import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'

const guard = async (pageContext: PageContextServer) => {
  if (!pageContext.user) {
    throw render('/login')
  }
  if (!pageContext.user.isAdmin) {
    throw render(403, { notAdmin: true })
  }
}
