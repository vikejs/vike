export { dev }
// TO-DO/eventually: remove if it doesn't end up being used
export { startupLog }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { ApiOptions } from './types.js'
import { assert, colorVike, colorVite, PROJECT_VERSION } from './utils.js'
import pc from '@brillout/picocolors'
import { processStartupLog } from '../vite/shared/loggerVite.js'

/**
 * Programmatically trigger `$ vike dev`
 *
 * https://vike.dev/api#dev
 */
async function dev(
  options: ApiOptions & { startupLog?: boolean } = {},
): Promise<{ viteServer: ViteDevServer; viteConfig: ResolvedConfig; viteVersion: string }> {
  const { viteConfigFromUserResolved } = await prepareViteApiCall(options, 'dev')
  const server = await createServer(viteConfigFromUserResolved)
  const viteServer = server
  const viteConfig = server.config
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)
  if (viteServer.httpServer) await viteServer.listen()
  if (options.startupLog) {
    if (viteServer.resolvedUrls) {
      startupLog(viteServer.resolvedUrls, viteServer)
    } else {
      // TO-DO/eventually: remove if it doesn't end up being used
      ;(viteConfig.server as Record<string, any>).startupLog = (resolvedUrls: ResolvedServerUrls) =>
        startupLog(resolvedUrls, viteServer)
    }
  }
  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}

const startTime = performance.now()
async function startupLog(resolvedUrls: ResolvedServerUrls, viteServer: ViteDevServer) {
  const viteConfig = viteServer.config
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)

  const startupDurationString = pc.dim(
    `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
  )
  const sep = pc.dim('·' as '-')
  const firstLine =
    `\n  ${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${sep} ${colorVite('Vite')} ${pc.cyan(`v${viteVersion}`)} ${sep} ${startupDurationString}\n` as const

  const ret = processStartupLog(firstLine, viteConfig)
  console.log(ret.firstLine)
  const { isCompact } = ret

  // We don't call viteServer.printUrls() because Vite throws an error if `resolvedUrls` is missing:
  // https://github.com/vitejs/vite/blob/df5a30d2690a2ebc4824a79becdcef30538dc602/packages/vite/src/node/server/index.ts#L745
  printServerUrls(resolvedUrls, viteConfig.server.host)

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
