// Utils needed by:
//  - runtime of server
//  - runtime of client (Client Routing)

// Ensure we don't bloat runtime of Server Routing with the utils down below
import { assertClientRouting } from '../../utils/assertRoutingType.js'
import { isBrowser } from '../../utils/isBrowser.js'
if (isBrowser()) {
  assertClientRouting()
}

export * from '../../utils/assert.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isObjectWithKeys.js'
export * from '../../utils/sorter.js'
export * from '../../utils/isPromise.js'
export * from '../../utils/isPlainObject.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/slice.js'
export * from '../../utils/isStringRecord.js'
export * from '../../utils/unique.js'
export * from '../../utils/isBrowser.js'
export * from '../../utils/parseUrl.js'
export * from '../hooks/executeHook.js'
export * from '../../utils/checkType.js'
export * from '../../utils/joinEnglish.js'
export * from '../../utils/projectInfo.js'
export * from '../../utils/truncateString.js'
