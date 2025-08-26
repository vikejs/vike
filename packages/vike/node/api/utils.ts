// Utils needed by Vike's API

// We call onLoad() here so that it's called even when only a subset of the API is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/path.js'
export * from '../../utils/isObject.js'
export * from '../../utils/assertVersion.js'
export * from '../../utils/pick.js'
export * from '../../utils/assertSetup.js'
