export default guard

import type { PageContextServer } from 'vike/types'
import { redirect } from 'vike/abort'

async function guard(pageContext: PageContextServer) {
  // Two cookies: the server must send both Set-Cookie headers
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-by-guard=1; Path=/')
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-by-guard-2=1; Path=/')
  throw redirect('/')
}
