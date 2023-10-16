// https://vike.dev/guard
export { guard }

import { render } from 'vike/abort'
import type { GuardAsync } from 'vike/types'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (!pageContext.user) {
    throw render('/login')
  }
  if (!pageContext.user.isAdmin) {
    throw render(403, { notAdmin: true })
  }
}
