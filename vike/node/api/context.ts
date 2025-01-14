export { getVikeCommand }
export { setVikeCommand }

import type { Command } from './types.js'
import { assert } from './utils.js'

let vikeCommand: Command | undefined

function getVikeCommand() {
  assert(vikeCommand)
  return vikeCommand
}
function setVikeCommand(command: Command) {
  assert(!vikeCommand)
  vikeCommand = command
}
