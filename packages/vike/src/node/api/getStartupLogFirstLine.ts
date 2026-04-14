export { getStartupLogFirstLine }

import type { ResolvedConfig } from 'vite'
import { colorVike } from '../../utils/colorsClient.js'
import { colorVite } from '../../utils/colorsServer.js'
import { PROJECT_VERSION } from '../../utils/PROJECT_VERSION.js'
import pc from '@brillout/picocolors'
import { assert } from '../../utils/assert.js'
import { processStartupLog } from '../vite/shared/loggerVite.js'

const startTime = performance.now()
function getStartupLogFirstLine(viteConfig: ResolvedConfig) {
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)
  const startupDurationString = pc.dim(
    `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
  )
  const sep = pc.dim('·' as '-')
  const firstLine =
    `\n  ${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${sep} ${colorVite('Vite')} ${pc.cyan(`v${viteVersion}`)} ${sep} ${startupDurationString}\n` as const
  const ret = processStartupLog(firstLine, viteConfig)
  const startupLogFirstLine = ret.firstLine
  const { isCompact } = ret
  return { startupLogFirstLine, isStartupLogCompact: isCompact }
}
