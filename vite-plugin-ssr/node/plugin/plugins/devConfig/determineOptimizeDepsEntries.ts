export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles'
import { getFilePathAbsolute, unique } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'
import { getConfigVps } from '../../../shared/getConfigVps'

async function determineOptimizeDepsEntries(config: ResolvedConfig, isDev: boolean): Promise<string[]> {
  let entries: string[] = []

  // V1 design
  {
    const { plusConfigsData } = await getConfigData(config.root, true, false, (await getConfigVps(config)).extensions)
    plusConfigsData.forEach((data) => {
      Object.values(data.configElements).forEach((configElement) => {
        const { plusValueFilePath, configEnv } = configElement
        if (plusValueFilePath && (configEnv === 'client-only' || configEnv === 'server-and-client')) {
          entries.push(getFilePathAbsolute(plusValueFilePath, config))
        }
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    pageFiles.forEach((filePath) => {
      const entry = getFilePathAbsolute(filePath, config)
      entries.push(entry)
    })
  }

  entries = unique(entries)
  return entries
}
