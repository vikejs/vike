// Utils needed by Server Routing.

// We call onLoad() here in order to make sure it's always called, even if only a subset of client/server-routing-runtime/** is loaded.
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/assertSingleInstance.js'
export * from '../../shared/hooks/executeHook.js'
export * from '../../utils/checkType.js' // Only used by Server Routing (not needed for Client Routing)
export * from '../../utils/getCurrentUrl.js'
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isCallable.js'
export * from '../../utils/isObject.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/projectInfo.js'
export * from '../../utils/slice.js'
export * from '../../utils/unique.js' // Only used by Server Routing (not needed for Client Routing)
