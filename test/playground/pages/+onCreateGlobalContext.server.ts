export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  const { pages } = globalContext
  let staticUrls: string[] = Object.values(pages)
    .map((p) => p.route)
    .filter((p) => typeof p === 'string')
    .filter((p) => !p.includes('@'))
  staticUrls.sort(lowerFirst((url) => url.length))
  globalContext.someWrapperObj = { staticUrls, neverPassedToClient: 123 }
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
    interface GlobalContextServer {
      someWrapperObj: {
        neverPassedToClient: 123
      }
    }
    interface GlobalContext {
      someWrapperObj: {
        staticUrls: string[]
      }
    }
  }
}
