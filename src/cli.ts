import { cac } from 'cac'
import { prerender } from './prerender'

const cli = cac('vite-plugin-ssr')

cli
  .command('prerender')
  .option('--partial', 'Allow only a subset of pages to be pre-rendered')
  .option('--client-router', 'Pre-render pageProps for client router')
  .action(async (options) => {
    await prerender(options.partial, options.clientRouter)
  })

// Listen to unknown commands
cli.on('command:*', () => {
  console.error('Invalid command: %s', cli.args.join(' '))
})

cli.help()
cli.version(require('../package.json').version)

cli.parse(
  process.argv.length === 2 ? [...process.argv, '--help'] : process.argv
)
