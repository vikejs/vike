// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { Config, PageContextServer } from 'vike/types'
import { render } from 'vike/abort'
import { names } from './names'

const onBeforeRender: Config['onBeforeRender'] = async (
  pageContext: PageContextServer
): Promise<{ pageContext: Partial<Vike.PageContext> }> => {
  const { name } = pageContext.routeParams
  if (name !== 'anonymous' && !names.includes(name)) {
    throw render(404, `Unknown name: ${name}.`)
  }
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}
