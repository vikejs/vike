// ./colorsServer.js => server only
// ./colorsClient.js => server & client

export { stripAnsi }
export { hasRed }
export { hasGreen }
export { hasYellow }
export { colorVite }

import pc from '@brillout/picocolors'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

const ansiRegex = getAnsiRegex()

function colorVite<Str extends string>(str: Str) {
  return pc.bold(pc.cyan(str))
}

// Copied from https://github.com/chalk/strip-ansi/blob/1fdc531d4046cbaa830460f5c74452bf1f0a0884/index.js
function stripAnsi(string: string) {
  // Even though the regex is global, we don't need to reset the `.lastIndex`
  // because unlike `.exec()` and `.test()`, `.replace()` does it automatically
  // and doing it manually has a performance penalty.
  return string.replace(ansiRegex, '')
}

// Copied from https://github.com/chalk/ansi-regex/blob/02fa893d619d3da85411acc8fd4e2eea0e95a9d9/index.js
function getAnsiRegex() {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|')
  return new RegExp(pattern, 'g')
}

function hasRed(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L57
  return str.includes('\x1b[31m')
}
function hasGreen(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L58
  return str.includes('\x1b[32m')
}
function hasYellow(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L59
  return str.includes('\x1b[33m')
}
