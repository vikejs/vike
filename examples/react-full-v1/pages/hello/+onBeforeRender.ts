export default onBeforeRender

import type { PageContextBuiltInServer } from 'vike/types'
import { render } from 'vike/abort'

import { names } from './names'

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
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
