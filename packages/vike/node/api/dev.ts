export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer, version as viteVersionVike } from 'vite'
import type { ApiOptions } from './types.js'
import { viteVersion as viteVersionUser } from '../vite/plugins/pluginCommon.js'
import { colorVike, colorVite, PROJECT_VERSION, removeEmptyLines } from './utils.js'
import { swallowViteConnectedMessage_clean } from '../vite/shared/loggerVite/removeSuperfluousViteLog.js'
import pc from '@brillout/picocolors'
import { cleanStartupLog } from '../vite/shared/loggerVite.js'

/**
 * Programmatically trigger `$ vike dev`
 *
 * https://vike.dev/api#dev
 */
async function dev(options: ApiOptions & { startupLog?: boolean } = {}) {
  const startTime = performance.now()
  const { viteConfigFromUserResolved } = await prepareViteApiCall(options, 'dev')
  const server = await createServer(viteConfigFromUserResolved)
  const viteVersion = viteVersionUser ?? viteVersionVike
  const viteServer = server
  const viteConfig = server.config
  if (viteServer.httpServer) await viteServer.listen()
  logVikeIntro(viteServer, viteConfig, viteVersion, startTime)
  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}

async function logVikeIntro(
  viteServer: ViteDevServer,
  viteConfig: ResolvedConfig,
  viteVersion: string,
  startTime: number,
) {
  if (viteServer.httpServer) {
    await viteServer.listen()

    // Restore console.log before printing welcome message
    swallowViteConnectedMessage_clean()

    const startupDurationString = pc.dim(
      `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
    )
    const sep = pc.dim('·' as '-')
    const logWelcome =
      `\n  ${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${sep} ${colorVite('Vite')} ${pc.cyan(`v${viteVersion}`)} ${sep} ${startupDurationString}\n` as const

    cleanStartupLog(logWelcome, viteConfig)

    viteServer.printUrls()
  } else {
    // Photon => middleware mode => `viteServer.httpServer === null`
  }

  viteServer.bindCLIShortcuts({ print: true })
  console.log()
}
