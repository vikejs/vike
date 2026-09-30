export default data

import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  pageContext.headersResponse.append('Set-Cookie', 'cookie-set-by-data=1; Path=/')
}
