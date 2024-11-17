import { assert } from './assert'
import { stripAnsi } from './stripAnsi'

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
    `└─${sep}─┘`
  ].join('\n')
}
