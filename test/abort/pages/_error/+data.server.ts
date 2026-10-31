export { data }

import type { PageContextServer } from '../../renderer/types'

function data(pageContext: PageContextServer) {
  const { abortStatusCode, abortReason } = pageContext
  return { abortStatusCode, abortReason }
}
