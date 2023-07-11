// Utils needed by Client Routing.

// Ensure we don't bloat the server-side with client utils
import { isBrowser } from '../../utils/isBrowser'
import { assert } from '../../utils/assert'
assert(isBrowser())
// Ensure we don't bloat Server Routing with Client Routing utils
import { assertClientRouting } from '../../utils/assertRoutingType'
assertClientRouting()

// We load the Server Routing utils: we tolerate the tiny amount of code that is only needed by Server Routing (only 1-2 lines).
// We re-export some of the utils down below only to list the utils needed by Client Routing.
export * from '../../client/utils'

export * from '../../utils/assert'
export * from '../../utils/assertSingleInstance'
export * from '../../utils/executeHook'
export * from '../../utils/getCurrentUrl'
export * from '../../utils/getGlobalObject'
export * from '../../utils/hasProp'
export * from '../../utils/isBrowser'
export * from '../../utils/isCallable'
export * from '../../utils/isObject'
export * from '../../utils/isPlainObject'
export * from '../../utils/isReact'
export * from '../../utils/isEquivalentError'
export * from '../../utils/objectAssign'
export * from '../../utils/parseUrl'
export * from '../../utils/projectInfo'
export * from '../../utils/PromiseType'
export * from '../../utils/serverSideRouteTo'
export * from '../../utils/sleep'
export * from '../../utils/slice'
export * from '../../utils/throttle'
export * from '../../utils/assertRoutingType'
