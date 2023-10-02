import type { Config, PageContextServer } from 'vike/types'
import { render } from 'vike/abort'

// The guard() hook enables to protect pages
const guard: Config['guard'] = async (pageContext: PageContextServer): Promise<void> => {
  if (pageContext.urlPathname === '/hello/forbidden') {
    await sleep(2 * 1000) // Unlike Route Functions, guard() can be async
    throw render(401, 'This page is forbidden.')
  }
}
export default guard

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
