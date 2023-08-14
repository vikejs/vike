// Utils needed by Client Routing.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad'
onLoad()

// We load the Server Routing utils: we tolerate the tiny amount of code that is only needed by Server Routing (only 1-2 lines).
// We re-export some of the utils down below only to list the utils needed by Client Routing.
export * from '../utils'

export * from '../../utils/assert'
export * from '../../utils/assertSingleInstance'
export * from '../../shared/hooks/executeHook'
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
