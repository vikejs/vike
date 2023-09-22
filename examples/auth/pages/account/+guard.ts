export default guard

import { render } from 'vite-plugin-ssr/abort'

function guard(pageContext: any) {
  if (!pageContext.user) {
    throw render('/login')
  }
}
