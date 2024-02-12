// TODO/v1-release: remove this file

export { runPrerenderFromAPI as prerender } from './runPrerender.js'

import { assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
assertWarning(
  false,
  `${pc.cyan("import { prerender } from 'vike/prerender'")} is deprecated in favor of ${pc.cyan(
    "import { prerender } from 'vike/api'"
  )}`,
  { onlyOnce: true }
)
