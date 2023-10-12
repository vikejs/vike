// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRender, PageContextServer } from 'vike/types'
import { render } from 'vike/abort'
import { names } from './names'

const onBeforeRender: OnBeforeRender = async (pageContext: PageContextServer): ReturnType<OnBeforeRender> => {
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
