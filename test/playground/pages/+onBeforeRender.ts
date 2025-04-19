export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const { pages } = pageContext.globalContext
  let staticUrls: string[] = Object.values(pages)
    .map((p) => p.route)
    .filter((p) => typeof p === 'string')
    .filter((p) => !p.includes('@'))
  staticUrls.sort(lowerFirst((url) => url.length))
  pageContext.someWrapperObj = { staticUrls, neverPassedToClient: 123 }
}

function lowerFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 < val2 ? -1 : 1
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      someWrapperObj: {
        neverPassedToClient?: 123
        staticUrls: string[]
      }
    }
  }
}
