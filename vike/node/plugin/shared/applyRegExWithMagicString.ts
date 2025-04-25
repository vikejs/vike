export { applyRegExpWithMagicString }

import type MagicString from 'magic-string'

function applyRegExpWithMagicString(magicString: MagicString, regExpStr: string, replacement: string) {
  const envStatementRegEx = new RegExp(regExpStr, 'g')
  let match: RegExpExecArray | null
  while ((match = envStatementRegEx.exec(magicString.original))) {
    magicString.overwrite(match.index, match.index + match[0].length, JSON.stringify(replacement))
  }
}
