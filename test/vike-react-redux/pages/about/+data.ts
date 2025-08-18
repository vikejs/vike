// Environment: server
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { fetchCountInit } from '../../components/Counter/fetchCountInit'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const countInitial = await fetchCountInit()
  return {
    countInitial,
  }
}
