// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.mjs'
onLoad()

export * from '../../utils/assert.mjs'
export * from '../../utils/projectInfo.mjs'
