// Utils needed by Server Routing.

// Ensure we don't bloat the server-side with client utils
import { isBrowser } from '../utils/isBrowser'
import { assert } from '../utils/assert'
assert(isBrowser())
// Ensure we don't bloat Client Routing with Server Routing utils
import { assertServerRouting } from '../utils/assertRoutingType'
assertServerRouting()

export * from '../utils/getCurrentUrl'
export * from '../utils/assert'
export * from '../utils/checkType'
export * from '../utils/hasProp'
export * from '../utils/isObject'
export * from '../utils/objectAssign'
export * from '../utils/parseUrl'
export * from '../utils/projectInfo'
export * from '../utils/isCallable'
export * from '../utils/slice'
export * from '../utils/getGlobalObject'
export * from '../utils/assertSingleInstance'
export * from '../utils/callHookWithTimeout'
export * from '../utils/unique'
