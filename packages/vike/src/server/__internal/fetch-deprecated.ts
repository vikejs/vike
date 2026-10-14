export { default } from './fetch.js'

// TO-DO/next-major-release: remove this export (the entire file)

import { assertWarning } from '../../utils/assert.js'
import pc from '@brillout/picocolors'
import '../assertEnvServer.js'

assertWarning(
  false,
  `${pc.cyan("import vike from 'vike/fetch'")} is deprecated, see ${pc.underline('https://vike.dev/migration/vike-fetch')}`,
  { onlyOnce: true },
)
