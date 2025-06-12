// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  return {
    pageContext: {
      globalOnBeforeRenderWasCalled: true,
      globalOnBeforeRenderWasCalledInEnv: typeof window === 'undefined' ? 'server' : 'client',
    },
  }
}
