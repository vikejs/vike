// Utils needed by:
//  - runtime of server
//  - runtime of client (Client Routing)

// Ensure we don't bloat runtime of Server Routing with the utils down below
import { assertClientRouting } from '../../utils/assertRoutingType.mjs'
import { isBrowser } from '../../utils/isBrowser.mjs'
if (isBrowser()) {
  assertClientRouting()
}

export * from '../../utils/assert.mjs'
export * from '../../utils/hasProp.mjs'
export * from '../../utils/isObjectWithKeys.mjs'
export * from '../../utils/sorter.mjs'
export * from '../../utils/isPromise.mjs'
export * from '../../utils/isPlainObject.mjs'
export * from '../../utils/objectAssign.mjs'
export * from '../../utils/slice.mjs'
export * from '../../utils/isStringRecord.mjs'
export * from '../../utils/unique.mjs'
export * from '../../utils/isBrowser.mjs'
export * from '../../utils/parseUrl.mjs'
export * from '../hooks/executeHook.mjs'
export * from '../../utils/checkType.mjs'
export * from '../../utils/joinEnglish.mjs'
export * from '../../utils/projectInfo.mjs'
export * from '../../utils/truncateString.mjs'
