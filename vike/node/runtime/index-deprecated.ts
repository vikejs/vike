// TO-DO: point package.json#exports['./server'] to this file.
export * from './index.js'

import { assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
assertWarning(
  false,
  [
    'You have outdated imports:',
    pc.bold(pc.red("  import { something } from 'vike/server'")),
    'Replace them with:',
    pc.bold(pc.green("  import { something } from 'vike'"))
    /* Add migration guide, with migration scritps such as `$ rename vike/server vike`
    `See ${pc.underline('https://vike.dev/migration/0.4.xxx')}`
    */
  ].join('\n'),
  { showStackTrace: true, onlyOnce: true }
)
