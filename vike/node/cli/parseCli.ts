export { parseCli }

import pc from '@brillout/picocolors'
import { projectInfo, includes } from './utils.js'

const commands = [
  { name: 'dev', desc: 'Start development server' },
  { name: 'build', desc: 'Build for production' },
  { name: 'preview', desc: 'Start preview server using production build' },
  { name: 'prerender', desc: 'Pre-render pages' }
] as const

function parseCli() {
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

  const configDefinedByCli: Record<string, unknown> = {}
  let isConfigArg = false
  for (const arg of process.argv.slice(3)) {
    if (isConfigArg) {
      try {
        Object.assign(configDefinedByCli, JSON.parse(arg))
      } catch (err) {
        console.error(err)
        wrongUsage(`Couldn't parse (see error above) JSON ${pc.bold(arg)}`)
      }
      continue
    }
    showHelpOrVersion(arg)
    if (arg === '--config') {
      isConfigArg = true
      continue
    }
    wrongUsage(`Unknown option ${pc.bold(arg)}`)
  }

  return { command, options: { configDefinedByCli } }
}

function showHelp(): never {
  const TAB = ' '.repeat(3)
  const nameMaxLength = Math.max(...commands.map((c) => c.name.length))
  console.log(
    [
      `vike@${projectInfo.projectVersion}`,
      '',
      'Usage:',
      ...[...commands, { name: '-v', desc: "Print Vike's installed version" }].map(
        (c) =>
          `  ${pc.dim('$')} ${pc.bold(`vike ${c.name}`)}${' '.repeat(nameMaxLength - c.name.length)}${TAB}${pc.dim(`# ${c.desc}`)}`
      ),
      '',
      'Options:',
      ` ${pc.bold('--config')} <JSON>${TAB}${pc.dim('# Set Vike and/or Vite configurations')}`,
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
  console.log(projectInfo.projectVersion)
  process.exit(1)
}

function wrongUsage(msg: string): never {
  console.error(pc.red(msg))
  console.log()
  showHelp()
}
