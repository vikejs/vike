export { formatHintLog }

import { assert } from './assert.js'
import { stripAnsi } from './colors.js'

function formatHintLog<Msg extends string>(msg: Msg) {
  assert(msg.length > 0)
  const msgLength = stripAnsi(msg).length
  const sep = '─'.repeat(msgLength)
  const top = `┌─${sep}─┐\n` as '|'
  const mid = `│ ${msg} │\n` as ` ${Msg} `
  const bot = `└─${sep}─┘` as '|'
  const msgWrapped = `${top}${mid}${bot}` as const
  return msgWrapped
}
