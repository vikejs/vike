// TODO/v1-release: remove this file

export { prerender } from '../api/prerender.js'

import { assertWarning } from '../../utils/assert.js'
import pc from '@brillout/picocolors'
assertWarning(
  false,
  `${pc.cyan("import { prerender } from 'vike/prerender'")} is deprecated in favor of ${pc.cyan(
    "import { prerender } from 'vike/api'",
  )}`,
  { onlyOnce: true },
)
