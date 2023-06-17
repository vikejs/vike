// Utils needed by:
//  - runtime of server
//  - runtime of client (Client Routing)

// Ensure we don't bloat runtime of Server Routing with the utils down below
import { assertClientRouting } from '../../utils/assertRoutingType'
import { isBrowser } from '../../utils/isBrowser'
if (isBrowser()) {
  assertClientRouting()
}

export * from '../../utils/assert'
export * from '../../utils/hasProp'
export * from '../../utils/isObjectWithKeys'
export * from '../../utils/sorter'
export * from '../../utils/isPromise'
export * from '../../utils/isPlainObject'
export * from '../../utils/objectAssign'
export * from '../../utils/slice'
export * from '../../utils/isStringRecord'
export * from '../../utils/unique'
export * from '../../utils/isBrowser'
export * from '../../utils/parseUrl'
export * from '../../utils/executeHook'
