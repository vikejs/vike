import { cac } from 'cac'

import { eject } from './command.js'
import { config } from './config.js'

const cli = cac('eject')

cli
  .command('[...dependencies]', 'Ejects a dependency from node_modules', { allowUnknownOptions: true })
  .option('-f, --force', 'Bypass git history check')
  .option('-v, --verbose', 'Verbose output')
  .action(eject)

cli.help()
cli.version(config.projectVersion)

cli.parse(process.argv.length === 2 ? [...process.argv, '--help'] : process.argv)

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
