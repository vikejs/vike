// Utils needed by Server Routing.

// DON'T include `utils/*` that are only needed by vite-plugin-ssr's server-side runtime.
// DON'T include `utils/*` that are only needed by Client Routing.

export * from '../utils/getCurrentUrl'
export * from '../utils/assert'
export * from '../utils/checkType'
export * from '../utils/hasProp'
export * from '../utils/isObject'
export * from '../utils/objectAssign'
export * from '../utils/parseUrl'
export * from '../utils/projectInfo'
export * from '../utils/isCallable'
export * from '../utils/slice'
export * from '../utils/getGlobalObject'
export * from '../utils/assertPackageInstances'
