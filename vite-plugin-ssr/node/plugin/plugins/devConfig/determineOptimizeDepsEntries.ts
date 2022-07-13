export { determineOptimizeDepsEntries }

import type {ResolvedConfig } from 'vite'
import { findPageFiles, isSSR_config, assert } from '../../utils'

async function determineOptimizeDepsEntries(config: ResolvedConfig): Promise<string[]> {
  const ssr = isSSR_config(config)
  assert(ssr === false) // In dev, `build.ssr` is always `false`
  const pageFiles = (await findPageFiles(config)).map(p => p.filePathAbsolue)
  return pageFiles
}
