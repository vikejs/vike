export { guard }

import type { GuardAsync } from 'vike/types'
import { render } from 'vike/abort'

// The guard() hook enables to protect pages
const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (pageContext.urlPathname === '/hello/forbidden') {
    await sleep(2 * 1000) // Unlike Route Functions, guard() can be async
    throw render(401, 'This page is forbidden.')
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
