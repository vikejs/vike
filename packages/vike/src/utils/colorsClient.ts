// ./colorsServer.js => server only
// ./colorsClient.js => server & client

// !!!WARNING!!! KEEP THIS FILE MINIMAL: to save KBs sent to the browser

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
