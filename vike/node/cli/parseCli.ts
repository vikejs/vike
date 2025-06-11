export { parseCli }
export type { Command }
export type { CliOptions }

import pc from '@brillout/picocolors'
import { assert, includes, PROJECT_VERSION } from './utils.js'
import { parseJson5 } from '../vite/shared/getEnvVarObject.js'

type CliOptions = Record<string, unknown>
type Command = 'dev' | 'build' | 'preview' | 'prerender'
const commands = [
  { name: 'dev', desc: 'Start development server' },
  { name: 'build', desc: 'Build for production' },
  { name: 'preview', desc: 'Start preview server using production build (only works for SSG apps)' },
  { name: 'prerender', desc: 'Pre-render pages (only needed when prerender.disableAutoRun is true)' },
] as const

function parseCli(): { command: Command; cliOptions: CliOptions } {
  const command = getCommand()

  const cliOptions = getCliOptions()

  return { command, cliOptions }
}

function getCommand() {
  const firstArg = process.argv[2]

  if (
    includes(
      commands.map((c) => c.name),
      firstArg,
    )
  ) {
    return firstArg
  }

  if (!firstArg) showHelp()
  showHelpOrVersion(firstArg)
  wrongUsage(`Unknown command ${pc.bold(firstArg)}`)
}

function getCliOptions() {
  let cliOptions: CliOptions = {}
  let configNameCurrent: string | undefined

  const commitIfDefinedWithoutValue = () => {
    if (configNameCurrent) commit(true)
  }
  const commit = (val: unknown) => {
    assert(configNameCurrent)
    cliOptions[configNameCurrent] = val
    configNameCurrent = undefined
  }

  for (const arg of process.argv.slice(3)) {
    showHelpOrVersion(arg)
    if (arg.startsWith('--')) {
      commitIfDefinedWithoutValue()
      configNameCurrent = arg.slice('--'.length)
    } else {
      if (!configNameCurrent) wrongUsage(`Unknown option ${pc.bold(arg)}`)
      commit(parseJson5(arg, `CLI option --${configNameCurrent}`))
    }
  }
  commitIfDefinedWithoutValue()

  return cliOptions
}

function showHelp(): never {
  const TAB = ' '.repeat(3)
  const nameMaxLength = Math.max(...commands.map((c) => c.name.length))
  console.log(
    [
      `vike@${PROJECT_VERSION}`,
      '',
      'Usage:',
      ...[...commands, { name: '-v', desc: "Print Vike's installed version" }].map(
        (c) =>
          `  ${pc.dim('$')} vike ${c.name.startsWith('-') ? pc.cyan(`${c.name}`) : pc.bold(`${c.name}`)}${' '.repeat(nameMaxLength - c.name.length)}${TAB}${pc.dim(`# ${c.desc}`)}`,
      ),
      '',
      'Common CLI options:',
      [`vike dev ${pc.cyan('--host')}`, `vike dev ${pc.cyan('--port')} 80`, `vike build ${pc.cyan('--mode')} staging`]
        .map((o) => `  ${pc.dim('$')} ${o}`)
        .join('\n'),
      '',
      `More Vike settings can be passed over the ${pc.cyan('VIKE_CONFIG')} environment variable or as ${pc.cyan('CLI options')}.`,
      `More Vite settings can be passed over the ${pc.cyan('VITE_CONFIG')} environment variable.`,
      ``,
      `See ${pc.underline('https://vike.dev/cli')} for more information.`,
    ].join('\n'),
  )
  process.exit(1)
}

function showHelpOrVersion(arg: string) {
  if (arg === '--version' || arg === '-v' || arg === '--v') {
    showVersion()
  }
  if (arg === '--help' || arg === '-h' || arg === '--h') {
    showHelp()
  }
}

function showVersion(): never {
  console.log(PROJECT_VERSION)
  process.exit(1)
}

function wrongUsage(msg: string): never {
  console.error(pc.red(msg))
  console.log()
  showHelp()
}
