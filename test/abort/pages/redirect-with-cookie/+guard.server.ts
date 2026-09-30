export default guard

import type { PageContextServer } from 'vike/types'
import { redirect } from 'vike/abort'

async function guard(pageContext: PageContextServer) {
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-by-guard=1; Path=/')
  throw redirect('/')
}
