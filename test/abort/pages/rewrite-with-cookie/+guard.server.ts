export default guard

import type { PageContextServer } from 'vike/types'
import { render } from 'vike/abort'

async function guard(pageContext: PageContextServer) {
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-before-rewrite=1; Path=/')
  throw render('/')
}
