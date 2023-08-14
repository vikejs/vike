// Utils needed by Client Routing.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.mjs'
onLoad()

// We load the Server Routing utils: we tolerate the tiny amount of code that is only needed by Server Routing (only 1-2 lines).
// We re-export some of the utils down below only to list the utils needed by Client Routing.
export * from '../server-routing-runtime/utils.mjs'

export * from '../../utils/assert.mjs'
export * from '../../utils/assertSingleInstance.mjs'
export * from '../../shared/hooks/executeHook.mjs'
export * from '../../utils/getCurrentUrl.mjs'
export * from '../../utils/getGlobalObject.mjs'
export * from '../../utils/hasProp.mjs'
export * from '../../utils/isBrowser.mjs'
export * from '../../utils/isCallable.mjs'
export * from '../../utils/isObject.mjs'
export * from '../../utils/isPlainObject.mjs'
export * from '../../utils/isReact.mjs'
export * from '../../utils/isEquivalentError.mjs'
export * from '../../utils/objectAssign.mjs'
export * from '../../utils/parseUrl.mjs'
export * from '../../utils/projectInfo.mjs'
export * from '../../utils/PromiseType.mjs'
export * from '../../utils/serverSideRouteTo.mjs'
export * from '../../utils/sleep.mjs'
export * from '../../utils/slice.mjs'
export * from '../../utils/throttle.mjs'
export * from '../../utils/assertRoutingType.mjs'
