// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import type { PageContextServer } from 'vike/types'

const data = async (pageContext: PageContextServer) => {
  const { name } = pageContext.routeParams
  return { name }
}
