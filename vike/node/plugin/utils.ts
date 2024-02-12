// Utils needed by Vike's Vite plugin.

// We call onLoad() here in order to make sure it's always called, even if only a subset of node/plugin/** is loaded.
//  - (Calling onLoad() in node/plugin/index.ts wouldn't be enough: for example if node/runtime/** mistakenly loads a node/plugin/** file.)
//  - (It isn't 100% guaranteed that onLoad() is called: it isn't called when the loaded module doesn't use utils.ts but it's unlikely.)
import { onLoad } from './onLoad.js'
onLoad()

// We tolerate the fact that we load all of the runtime utils even though some of it isn't needed
export * from '../runtime/utils.js'

// Utils only needed by `plugin/*`
export * from '../../utils/viteIsSSR.js'
export * from '../../utils/getFilePathAbsolute.js'
export * from '../../utils/requireResolve.js'
export * from '../../utils/arrayIncludes.js'
export * from '../../utils/isDev.js'
export * from '../../utils/getMostSimilar.js'
export * from '../../utils/getRandomId.js'
export * from '../../utils/joinEnglish.js'
export * from '../../utils/escapeRegex.js'
export * from '../../utils/stripAnsi.js'
export * from '../../utils/trimWithAnsi.js'
export * from '../../utils/removeEmptyLines.js'
export * from '../../utils/findFile.js'
export * from '../../utils/getPropAccessNotation.js'
export * from '../../utils/mergeCumulativeValues.js'
export * from '../../utils/deepEqual.js'
export * from '../../utils/assertKeys.js'
export * from '../../utils/injectRollupInputs.js'
export * from '../../utils/humanizeTime.js'
export * from '../../utils/pLimit.js'
export * from '../../utils/isVersionOrAbove.js'
