// TO-DO/next-major-release: remove this file

export { prerender } from '../api/prerender.js'

import { assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
assertWarning(
  false,
  `${pc.cyan("import { prerender } from 'vike/cli'")} is deprecated in favor of ${pc.cyan(
    "import { prerender } from 'vike/api'",
  )}`,
  { onlyOnce: true },
)
