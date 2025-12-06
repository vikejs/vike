export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer, version as viteVersionVike } from 'vite'
import type { ApiOptions } from './types.js'
import { viteVersionUser } from '../vite/plugins/pluginCommon.js'
import { colorVike, colorVite, PROJECT_VERSION } from './utils.js'
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
  let isCompact = true
  if (viteServer.httpServer) {
    // Restore console.log before printing welcome message
    swallowViteConnectedMessage_clean()

    const startupDurationString = pc.dim(
      `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
    )
    const sep = pc.dim('·' as '-')
    const logWelcome =
      `\n  ${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${sep} ${colorVite('Vite')} ${pc.cyan(`v${viteVersion}`)} ${sep} ${startupDurationString}\n` as const

    const ret = cleanStartupLog(logWelcome, viteConfig)
    console.log(ret.msg)
    isCompact = ret.isCompact

    // We don't call viteServer.printUrls() because Vite throws an error if `resolvedUrls` is missing:
    // https://github.com/vitejs/vite/blob/df5a30d2690a2ebc4824a79becdcef30538dc602/packages/vite/src/node/server/index.ts#L745
    printServerUrls(
      viteServer.resolvedUrls || { local: ['http://localhost:3000'], network: [] },
      viteConfig.server.host,
    )
  } else {
    // Photon => middleware mode => `viteServer.httpServer === null`
  }

  viteServer.bindCLIShortcuts({ print: true })
  if (!isCompact) console.log()
}

// Copied & adapted from Vite
// https://github.com/vitejs/vite/blob/df5a30d2690a2ebc4824a79becdcef30538dc602/packages/vite/src/node/logger.ts#L168-L188
function printServerUrls(urls: ResolvedServerUrls, optionsHost: string | boolean | undefined): void {
  // [Begin] interop
  const colors = pc
  const info = (msg: string) => console.log(msg)
  // [End] interop
  const colorUrl = (url: string) => colors.underline(removeTrailingSlash(url))
  for (const url of urls.local) {
    info(`  ${colors.green('➜')}  ${colors.bold('Local')}:   ${colorUrl(url)}`)
  }
  for (const url of urls.network) {
    info(`  ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}`)
  }
  if (urls.network.length === 0 && optionsHost === undefined) {
    info(
      colors.dim(`  ${colors.green('➜')}  ${colors.bold('Network')}: use `) +
        colors.bold('--host') +
        colors.dim(' to expose'),
    )
  }
}
interface ResolvedServerUrls {
  local: string[]
  network: string[]
}
function removeTrailingSlash(url: string) {
  if (url.endsWith('/')) return url.slice(0, -1) // remove trailing slash
  return url
}
