// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import type { PageContextServer } from 'vike/types'
import { render } from 'vike/abort'
import { names } from './names'

async function data(pageContext: PageContextServer) {
  const { name } = pageContext.routeParams
  if (name !== 'anonymous' && !names.includes(name)) {
    throw render(404, `Unknown name: ${name}.`)
  }
  return { name }
}
