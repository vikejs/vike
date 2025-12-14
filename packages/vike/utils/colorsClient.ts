// ./colorsServer.js => server only
// ./colorsClient.js => server & client

export { colorVike }
export { colorError }
export { colorWarning }

import pc from '@brillout/picocolors'

function colorVike<Str extends string>(str: Str) {
  return pc.bold(pc.yellow(str))
}
function colorError<Str extends string>(str: Str) {
  return pc.bold(pc.red(str))
}
function colorWarning<Str extends string>(str: Str) {
  return pc.yellow(str)
}
