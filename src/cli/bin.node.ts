import { cac } from 'cac'
import { prerender } from '../prerender'

const cli = cac('vite-plugin-ssr')

cli
  .command('prerender')
  .option('--partial', 'allow only a subset of pages to be pre-rendered')
  .option(
    '--client-router',
    'serialize `pageProps` to JSON files for Client-side Routing'
  )
  .option('--base <path>', `[string] public base path (default: /)`)
  .action(async (options) => {
    const { partial, clientRouter, base } = options
    await prerender({ partial, clientRouter, base })
  })

// Listen to unknown commands
cli.on('command:*', () => {
  console.error('Invalid command: %s', cli.args.join(' '))
})

cli.help()
cli.version(require('../../package.json').version)

cli.parse(
  process.argv.length === 2 ? [...process.argv, '--help'] : process.argv
)
