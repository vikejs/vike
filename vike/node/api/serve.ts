export { serve }

import { resolveConfig } from './resolveConfig.js'
import { isVikeCli } from './isVikeCli.js'
import { startTime } from '../cli/bin.js'
import { projectInfo } from '../../utils/projectInfo.js'
import { createServer } from 'vite'
import pc from '@brillout/picocolors'

const { projectName, projectVersion } = projectInfo

async function serve() {
  // Adds vike to viteConfig if not present
  const { viteConfig } = await resolveConfig({}, 'serve')
  if (!isVikeCli) return createServer(viteConfig)

  const server = await createServer(viteConfig)
  await server.listen()
  const info = server.config.logger.info
  const startupDurationString = pc.dim(
    `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`
  )
  const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0
  info(`\n  ${pc.cyan(`${pc.bold(projectName)} v${projectVersion}`)}  ${startupDurationString}\n`, {
    clear: !hasExistingLogs
  })

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
  return server
}
