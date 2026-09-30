export default guard

import type { PageContextServer } from 'vike/types'
import { render } from 'vike/abort'

async function guard(pageContext: PageContextServer) {
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-before-render=1; Path=/')
  throw render(403, 'Testing cookie before throw render().')
}
