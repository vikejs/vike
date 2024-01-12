export { prerender }

import { resolve } from 'path'
import { runPrerender_forceExit, runPrerenderFromCLI } from '../prerender/runPrerender.js'
import { assertUsage } from './utils.js'

async function prerender(options: any) {
  assertOptions()
  const { partial, noExtraDir, base, parallel, outDir, configFile } = options
  const root = options.root && resolve(options.root)
  await runPrerenderFromCLI({ partial, noExtraDir, base, root, parallel, outDir, configFile })
  runPrerender_forceExit()
}

function assertOptions() {
  // Using process.argv because cac convert names to camelCase
  const rawOptions = process.argv.slice(3)
  Object.values(rawOptions).forEach((option) => {
    assertUsage(
      !option.startsWith('--') ||
        [
          '--root',
          '--partial',
          '--noExtraDir',
          '--clientRouter',
          '--base',
          '--parallel',
          '--outDir',
          '--configFile'
        ].includes(option),
      'Unknown option: ' + option
    )
  })
}
