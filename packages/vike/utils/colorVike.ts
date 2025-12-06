export { colorVike }

import pc from '@brillout/picocolors'

function colorVike<Str extends string>(str: Str) {
  return pc.bold(pc.yellow(str))
}
