export { applyRegExpWithMagicString }

import type MagicString from 'magic-string'

function applyRegExpWithMagicString(magicString: MagicString, envStatementRegExStr: string, envVal: string) {
  const envStatementRegEx = new RegExp(envStatementRegExStr, 'g')
  let match: RegExpExecArray | null
  while ((match = envStatementRegEx.exec(magicString.original))) {
    magicString.overwrite(match.index, match.index + match[0].length, JSON.stringify(envVal))
  }
}
