export { cmd }
export { isObject }
import { execSync } from 'node:child_process'

function cmd(command: string, { cwd }: { cwd?: string } = { cwd: undefined }): string {
  let stdout = execSync(command, { encoding: 'utf8', cwd })
  stdout = stdout.split(/\s/).filter(Boolean).join(' ')
  return stdout
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
