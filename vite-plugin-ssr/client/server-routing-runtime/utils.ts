// Utils needed by Server Routing.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.mjs'
onLoad()

export * from '../../utils/assert.mjs'
export * from '../../utils/assertSingleInstance.mjs'
export * from '../../shared/hooks/executeHook.mjs'
export * from '../../utils/checkType.mjs' // Only used by Server Routing (not needed for Client Routing)
export * from '../../utils/getCurrentUrl.mjs'
export * from '../../utils/getGlobalObject.mjs'
export * from '../../utils/hasProp.mjs'
export * from '../../utils/isCallable.mjs'
export * from '../../utils/isObject.mjs'
export * from '../../utils/objectAssign.mjs'
export * from '../../utils/parseUrl.mjs'
export * from '../../utils/projectInfo.mjs'
export * from '../../utils/slice.mjs'
export * from '../../utils/unique.mjs' // Only used by Server Routing (not needed for Client Routing)
