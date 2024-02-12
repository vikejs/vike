// Utils needed by Client Routing.

// We call onLoad() here in order to make sure it's always called, even if only a subset of client/client-routing-runtime/** is loaded.
//  - (Otherwise we'd need to call onLoad() in both client/client-routing-runtime/index.ts and client/client-routing-runtime/entry.ts)
//  - (Calling onLoad() here is also future-proof in case we move `import { navigate } from 'vike/client/router'` to `import { navigate } from 'vike/navigate';` or `import { navigate } from 'vike/client';`.)
//  - (Also, calling onLoad() here avoids node/** to mistakenly load a client/** file, as the assertIsBrowser() call inside onLoad() will throw an error.)
import { onLoad } from './onLoad.js'
onLoad()

// We load the Server Routing utils: we tolerate the tiny amount of code that is only needed by Server Routing (only 1-2 lines).
// We re-export some of the utils down below only to list the utils needed by Client Routing.
export * from '../server-routing-runtime/utils.js'

export * from '../../utils/assert.js'
export * from '../../utils/assertSingleInstance.js'
export * from '../../shared/hooks/executeHook.js'
export * from '../../utils/getCurrentUrl.js'
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isBrowser.js'
export * from '../../utils/isCallable.js'
export * from '../../utils/isObject.js'
export * from '../../utils/isPlainObject.js'
export * from '../../utils/isReact.js'
export * from '../../utils/isSameErrorMessage.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/projectInfo.js'
export * from '../../utils/PromiseType.js'
export * from '../../utils/serverSideRouteTo.js'
export * from '../../utils/sleep.js'
export * from '../../utils/slice.js'
export * from '../../utils/throttle.js'
export * from '../../utils/assertRoutingType.js'
export * from '../../utils/onPageVisibilityChange.js'
export * from '../../utils/isExternalLink.js'
