// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { PageContextServer } from 'vike/types'

const onBeforeRender = async (pageContext: PageContextServer) => {
  return {
    pageContext: {
      perPageOnBeforeRenderWasCalled: true,
      perPageOnBeforeRenderWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
    },
  }
}
