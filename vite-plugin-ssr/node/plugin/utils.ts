// Utils needed by vite-plugin-ssr's Vite plugin.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad'
onLoad()

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
export * from '../../utils/joinEnglish'
export * from '../../utils/escapeRegex'
export * from '../../utils/stripAnsi'
export * from '../../utils/trimWithAnsi'
export * from '../../utils/removeEmptyLines'
