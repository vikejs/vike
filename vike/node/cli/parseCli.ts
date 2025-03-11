export { parseCli }
export type { Command }

import pc from '@brillout/picocolors'
import { projectInfo, includes, PROJECT_VERSION } from './utils.js'

type Command = 'dev' | 'build' | 'preview' | 'prerender'
const commands = [
  { name: 'dev', desc: 'Start development server' },
  { name: 'build', desc: 'Build for production' },
  { name: 'preview', desc: 'Start preview server using production build (only works for SSG apps)' },
  { name: 'prerender', desc: 'Pre-render pages (only needed when partial.disableAutoRun is true)' }
] as const

function parseCli(): { command: Command } {
  const command = (() => {
    const firstArg = process.argv[2]
    if (!firstArg) {
      showHelp()
    }
    showHelpOrVersion(firstArg)
    if (
      includes(
        commands.map((c) => c.name),
        firstArg
      )
    )
      return firstArg
    wrongUsage(`Unknown command ${pc.bold(firstArg)}`)
  })()

  for (const arg of process.argv.slice(3)) {
    showHelpOrVersion(arg)
    wrongUsage(`Unknown option ${pc.bold(arg)}`)
  }

  return { command }
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
          `  ${pc.dim('$')} ${pc.bold(`vike ${c.name}`)}${' '.repeat(nameMaxLength - c.name.length)}${TAB}${pc.dim(`# ${c.desc}`)}`
      ),
      '',
      `More infos at ${pc.underline('https://vike.dev/cli')}`
    ].join('\n')
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
