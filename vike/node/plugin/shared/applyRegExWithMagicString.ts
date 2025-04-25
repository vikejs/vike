export { applyRegExpWithMagicString }

import type MagicString from 'magic-string'

function applyRegExpWithMagicString(magicString: MagicString, regExp: string | RegExp, replacement: string) {
  const envStatementRegEx = typeof regExp === 'string' ? new RegExp(regExp, 'g') : regExp
  let match: RegExpExecArray | null
  while ((match = envStatementRegEx.exec(magicString.original))) {
    magicString.overwrite(match.index, match.index + match[0].length, JSON.stringify(replacement))
  }
}
