export { isVikeCli }
export { setContextCliCommand }
export { getCliOptions }

import type { CliOptions, Command } from './parseCli.js'
import { assert } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import './assertEnvCli.js'
const globalObject = getGlobalObject<{ cliCommand?: CliCommand }>('cli/context.ts', {})

type CliCommand = {
  command: Command
  cliOptions: CliOptions
}
function getCliOptions(): CliOptions | null {
  return globalObject.cliCommand?.cliOptions ?? null
}
function isVikeCli(): boolean {
  return !!globalObject.cliCommand
}
function setContextCliCommand(command: Command, cliOptions: CliOptions): void {
  assert(!globalObject.cliCommand)
  globalObject.cliCommand = { command, cliOptions }
}
