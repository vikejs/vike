export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../helpers'
import { makeFilePathAbsolute } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'

async function determineOptimizeDepsEntries(config: ResolvedConfig, isDev: boolean): Promise<string[]> {
  const entries: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, false)
    pageConfigsData.forEach((pageConfigData) => {
      // TODO
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    pageFiles.forEach((filePath) => {
      const entry = makeFilePathAbsolute(filePath, config)
      entries.push(entry)
    })
  }

  return entries
}
