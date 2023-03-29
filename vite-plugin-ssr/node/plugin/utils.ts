// Utils needed by vite-plugin-ssr's Vite plugin.

// Ensure we don't bloat the server runtime with plugin utils
import { assertIsVitePluginCode } from '../../utils/assertIsVitePluginCode'
assertIsVitePluginCode()

// We tolerate the fact that we load all of the runtime utils even though some of it isn't needed
export * from '../runtime/utils'

// Utils only needed by `plugin/*`
export * from '../../utils/viteIsSSR'
export * from '../../utils/getFilePathAbsolute'
export * from '../../utils/getDependencyPackageJson'
export * from '../../utils/addFileExtensionsToRequireResolve'
export * from '../../utils/assertDefaultExport'
export * from '../../utils/arrayIncludes'
export * from '../../utils/isDev'
export * from '../../utils/objectKeys'
export * from '../../utils/getMostSimilar'
export * from '../../utils/getRandomId'
