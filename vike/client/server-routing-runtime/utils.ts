// Utils needed by Vike's client runtime (with Server Routing)

// We call onLoad() here so that it's called even when only a subset of the runtime is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/assertSingleInstance.js'
export * from '../../utils/checkType.js' // Only used by Server Routing (not needed for Client Routing)
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isCallable.js'
export * from '../../utils/isObject.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/slice.js'
export * from '../../utils/unique.js' // Only used by Server Routing (not needed for Client Routing)
export * from '../../utils/getPropAccessNotation.js'
