// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  return {
    pageContext: {
      perPageOnBeforeRenderWasCalled: true,
      perPageOnBeforeRenderWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
    },
  }
}
