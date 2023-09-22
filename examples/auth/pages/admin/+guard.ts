export default guard

import { render } from 'vite-plugin-ssr/abort'
import type { PageContext } from 'vite-plugin-ssr/types'

function guard(pageContext: PageContext) {
  if (!pageContext.user) {
    throw render('/login')
  }
  if (!pageContext.user.isAdmin) {
    throw render(403, { notAdmin: true })
  }
}
