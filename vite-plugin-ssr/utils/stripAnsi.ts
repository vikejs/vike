export { stripAnsi }

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

const ansiRegex = getAnsiRegex()

// Copied from https://github.com/chalk/strip-ansi/blob/1fdc531d4046cbaa830460f5c74452bf1f0a0884/index.js
function stripAnsi(string: string) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``)
  }

  // Even though the regex is global, we don't need to reset the `.lastIndex`
  // because unlike `.exec()` and `.test()`, `.replace()` does it automatically
  // and doing it manually has a performance penalty.
  return string.replace(ansiRegex, '')
}

// Copied from https://github.com/chalk/ansi-regex/blob/02fa893d619d3da85411acc8fd4e2eea0e95a9d9/index.js
function getAnsiRegex() {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
  ].join('|')
  return new RegExp(pattern, 'g')
}
