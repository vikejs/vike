// Utils needed by Vike's Vite plugin.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad'
onLoad()

// We tolerate the fact that we load all of the runtime utils even though some of it isn't needed
export * from '../runtime/utils'

// Utils only needed by `plugin/*`
export * from '../../utils/viteIsSSR'
export * from '../../utils/requireResolve'
export * from '../../utils/includes'
export * from '../../utils/isDev'
export * from '../../utils/getMostSimilar'
export * from '../../utils/getRandomId'
export * from '../../utils/joinEnglish'
export * from '../../utils/escapeRegex'
export * from '../../utils/stripAnsi'
export * from '../../utils/trimWithAnsi'
export * from '../../utils/removeEmptyLines'
export * from '../../utils/findPackageJson'
export * from '../../utils/getPropAccessNotation'
export * from '../../utils/deepEqual'
export * from '../../utils/assertKeys'
export * from '../../utils/injectRollupInputs'
export * from '../../utils/humanizeTime'
export * from '../../utils/pLimit'
export * from '../../utils/assertVersion'
export * from '../../utils/isFilePathAbsoluteFilesystem'
export * from '../../utils/isArray'
export * from '../../utils/PROJECT_VERSION'
