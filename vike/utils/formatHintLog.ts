import { assert } from './assert.js'
import { stripAnsi } from './stripAnsi.js'

export { formatHintLog }

function formatHintLog(msg: string) {
  assert(msg.length > 0)
  const msgLength = stripAnsi(msg).length
  const sep = '─'.repeat(msgLength)
  return [
    // prettier-ignore
    // biome-ignore format:
    `┌─${sep}─┐`,
    `│ ${msg} │`,
    `└─${sep}─┘`,
  ].join('\n')
}
