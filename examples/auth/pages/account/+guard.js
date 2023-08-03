export default guard

import { render } from 'vite-plugin-ssr/abort'

function guard(pageContext) {
  if (!pageContext.user) {
    throw render('/login')
  }
}
