export { isVikeCli }
export { setContextCliCommand }
// export { getCliCommand }

import type { Command } from './parseCli.js'
import { assert, getGlobalObject } from './utils.js'
const globalObject = getGlobalObject<{ cliCommand?: Command }>('cli/context.ts', {})

function getCliCommand(): Command | undefined {
  return globalObject.cliCommand
}
function isVikeCli(): boolean {
  return !!globalObject.cliCommand
}
function setContextCliCommand(command: Command): void {
  assert(!globalObject.cliCommand)
  globalObject.cliCommand = command
}
