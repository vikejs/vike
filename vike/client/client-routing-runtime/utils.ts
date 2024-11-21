// Utils needed by Client Routing.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/assertSingleInstance.js'
export * from '../../shared/hooks/executeHook.js'
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isBrowser.js'
export * from '../../utils/isCallable.js'
export * from '../../utils/isObject.js'
export * from '../../utils/isPlainObject.js'
export * from '../../utils/isReact.js'
export * from '../../utils/isSameErrorMessage.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/PromiseType.js'
export * from '../../utils/redirectHard.js'
export * from '../../utils/sleep.js'
export * from '../../utils/slice.js'
export * from '../../utils/throttle.js'
export * from '../../utils/assertRoutingType.js'
export * from '../../utils/onPageVisibilityChange.js'
export * from '../../utils/augmentType.js'
export * from '../../utils/PROJECT_VERSION.js'
export * from '../../utils/genPromise.js'
