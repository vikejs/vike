// Utils needed by Server Routing.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad'
onLoad()

export * from '../../utils/assert'
export * from '../../utils/assertSingleInstance'
export * from '../../shared/hooks/executeHook'
export * from '../../utils/checkType' // Only used by Server Routing (not needed for Client Routing)
export * from '../../utils/getCurrentUrl'
export * from '../../utils/getGlobalObject'
export * from '../../utils/hasProp'
export * from '../../utils/isCallable'
export * from '../../utils/isObject'
export * from '../../utils/objectAssign'
export * from '../../utils/parseUrl'
export * from '../../utils/projectInfo'
export * from '../../utils/slice'
export * from '../../utils/unique' // Only used by Server Routing (not needed for Client Routing)
