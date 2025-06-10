import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
assertIsNotBrowser()

// - Server-side bloat is negligible
// - The Vite plugin imports the server runtime anyways
export * from '../runtime/utils.js'

export * from '../../utils/assert.js'
export * from '../../utils/getFileExtension.js'
export * from '../../utils/isPlainObject.js'
export * from '../../utils/checkType.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/checkType.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/parseUrl-extras.js'
export * from '../../utils/isObject.js'
export * from '../../utils/assertIsNotBrowser.js'
export * from '../../utils/isNullish.js'
export * from '../../utils/unique.js'
export * from '../../utils/debug.js'
