export { startupLog }

import type { PreviewServer, ResolvedConfig, ViteDevServer } from 'vite'
import { colorVike } from '../../utils/colorsClient.js'
import { colorVite } from '../../utils/colorsServer.js'
import { PROJECT_VERSION } from '../../utils/PROJECT_VERSION.js'
import pc from '@brillout/picocolors'
import { assert } from '../../utils/assert.js'
import { processStartupLog } from '../vite/shared/loggerVite.js'
import './assertEnvApiDevAndProd.js'

const startTime = performance.now()

function startupLog(viteConfigResolved: ResolvedConfig, viteServer: PreviewServer | ViteDevServer | null) {
  const { startupLogFirstLine, isStartupLogCompact } = getStartupLogFirstLine(viteConfigResolved, !viteServer)
  console.log(startupLogFirstLine)
  if (viteServer) {
    // Vite throws an error if `resolvedUrls` is missing:
    // https://github.com/vitejs/vite/blob/df5a30d2690a2ebc4824a79becdcef30538dc602/packages/vite/src/node/server/index.ts#L745
    if (viteServer.resolvedUrls) viteServer.printUrls()
    viteServer.bindCLIShortcuts({ print: true })
  }
  if (!isStartupLogCompact) console.log()
}

function getStartupLogFirstLine(viteConfig: ResolvedConfig, veryCompact?: boolean) {
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)
  const startupDurationString = pc.dim(
    `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
  )
  const sep = pc.dim('·' as '-')
  const firstLine =
    `${veryCompact ? '' : '\n  '}${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${sep} ${colorVite('Vite')} ${pc.cyan(`v${viteVersion}`)} ${sep} ${startupDurationString}${veryCompact ? '' : '\n'}` as const
  const ret = processStartupLog(firstLine, viteConfig, veryCompact)
  const startupLogFirstLine = ret.firstLine
  const { isCompact } = ret
  return { startupLogFirstLine, isStartupLogCompact: isCompact }
}
