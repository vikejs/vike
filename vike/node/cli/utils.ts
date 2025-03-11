// Utils needed by Vike's CLI

// We call onLoad() here so that it's called even when only a subset of the CLI is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/projectInfo.js'
export * from '../../utils/PROJECT_VERSION.js'
export * from '../../utils/includes.js'
export * from '../../utils/getGlobalObject.js'
