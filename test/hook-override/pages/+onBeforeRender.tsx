// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { PageContextServer } from 'vike/types'

const onBeforeRender = async (pageContext: PageContextServer) => {
  return {
    pageContext: {
      globalOnBeforeRenderWasCalled: true,
      globalOnBeforeRenderWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
    },
  }
}
