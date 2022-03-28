import { assert } from '../utils'

export { applyDev }

function applyDev(_config: unknown, { command, mode }: { command: string; mode: string }): boolean {
  assert(command)
  assert(mode)
  return command === 'serve' && mode === 'development'
}
