// Utils needed by Client Routing.

// We assume all runtime entries will load this utils.ts file
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
export * from '../../utils/isEquivalentError.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/projectInfo.js'
export * from '../../utils/PromiseType.js'
export * from '../../utils/serverSideRouteTo.js'
export * from '../../utils/sleep.js'
export * from '../../utils/slice.js'
export * from '../../utils/throttle.js'
export * from '../../utils/assertRoutingType.js'
