// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync, PageContextBuiltInServer } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const { name } = pageContext.routeParams
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}
