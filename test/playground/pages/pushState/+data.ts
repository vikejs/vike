import type { PageContextServer } from 'vike/types'

export default async (pageContext: PageContextServer) => {
  if (pageContext.urlParsed.search['throw-null'] !== undefined) throw null
  const timestamp = new Date().getTime()
  return { timestamp }
}
