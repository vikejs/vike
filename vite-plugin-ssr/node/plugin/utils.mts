// Utils needed by vite-plugin-ssr's Vite plugin.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.mjs'
onLoad()

// We tolerate the fact that we load all of the runtime utils even though some of it isn't needed
export * from '../runtime/utils.mjs'

// Utils only needed by `plugin/*`
export * from '../../utils/viteIsSSR.mjs'
export * from '../../utils/getFilePathAbsolute.mjs'
export * from '../../utils/getDependencyPackageJson.mjs'
export * from '../../utils/addFileExtensionsToRequireResolve.mjs'
export * from '../../utils/assertDefaultExport.mjs'
export * from '../../utils/arrayIncludes.mjs'
export * from '../../utils/isDev.mjs'
export * from '../../utils/objectKeys.mjs'
export * from '../../utils/getMostSimilar.mjs'
export * from '../../utils/getRandomId.mjs'
export * from '../../utils/joinEnglish.mjs'
export * from '../../utils/escapeRegex.mjs'
export * from '../../utils/stripAnsi.mjs'
export * from '../../utils/trimWithAnsi.mjs'
export * from '../../utils/removeEmptyLines.mjs'
