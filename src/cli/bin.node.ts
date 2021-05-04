import { cac } from 'cac'
import { prerender } from '../prerender'
const pkg = require('../../../package.json')

const cli = cac(pkg.name)

cli
  .command('prerender')
  .option('--partial', 'allow only a subset of pages to be pre-rendered')
  .option(
    '--root <path>',
    '[string] root directory of your project (where `vite.config.js` and `dist/` live) (default: `process.cwd()`)'
  )
  .option('--client-router', 'serialize `pageContext` to JSON files for Client-side Routing')
  .option('--base <path>', `[string] public base path (default: /)`)
  .action(async (options) => {
    const { partial, clientRouter, base, root } = options
    await prerender({ partial, clientRouter, base, root })
  })

// Listen to unknown commands
cli.on('command:*', () => {
  console.error('Invalid command: %s', cli.args.join(' '))
})

cli.help()
cli.version(pkg.version)

cli.parse(process.argv.length === 2 ? [...process.argv, '--help'] : process.argv)

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
