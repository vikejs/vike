export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  const { req } = pageContext
  const { user } = req
  const userFullName = user?.fullName
  pageContext.user = user
  pageContext.userFullName = userFullName
}
