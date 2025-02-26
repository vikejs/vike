// Utils needed by Vike's Vite plugin

// We call onLoad() here so that it's called even when only a subset of the plugin is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
import { onLoad } from './onLoad.js'
onLoad()

// It's common practice for Vike's Vite plugin to import from Vike's sever runtime
export * from '../runtime/utils.js'

// Utils only needed by `plugin/*`
export * from '../../utils/requireResolve.js'
export * from '../../utils/includes.js'
export * from '../../utils/isDev.js'
export * from '../../utils/getMostSimilar.js'
export * from '../../utils/getRandomId.js'
export * from '../../utils/joinEnglish.js'
export * from '../../utils/escapeRegex.js'
export * from '../../utils/stripAnsi.js'
export * from '../../utils/trimWithAnsi.js'
export * from '../../utils/removeEmptyLines.js'
export * from '../../utils/findPackageJson.js'
export * from '../../utils/getPropAccessNotation.js'
export * from '../../utils/deepEqual.js'
export * from '../../utils/assertKeys.js'
export * from '../../utils/injectRollupInputs.js'
export * from '../../utils/humanizeTime.js'
export * from '../../utils/pLimit.js'
export * from '../../utils/assertVersion.js'
export * from '../../utils/isFilePathAbsoluteFilesystem.js'
export * from '../../utils/isArray.js'
export * from '../../utils/PROJECT_VERSION.js'
export * from '../../utils/isEqualStringList.js'
export * from '../../utils/isDocker.js'
export * from '../../utils/isVitest.js'
