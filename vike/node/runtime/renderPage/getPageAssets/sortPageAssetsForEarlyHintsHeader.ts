export { sortPageAssetsForEarlyHintsHeader }

import { getGlobalContext } from '../../globalContext.js'
import { higherFirst } from '../../utils.js'
import type { PageAsset } from '../getPageAssets.js'

function sortPageAssetsForEarlyHintsHeader(pageAssets: PageAsset[]) {
  const globalContext = getGlobalContext()
  pageAssets.sort(
    higherFirst(({ assetType }) => {
      // In dev, we load scripts first in order to parallelize I/O and CPU
      if (!globalContext.isProduction && assetType === 'script') {
        return 1
      }

      let priority = 0

      // CSS has highest priority
      if (assetType === 'style') return priority
      priority--

      // Visual assets have high priority
      if (assetType === 'font') return priority
      priority--
      if (assetType === 'image') return priority
      priority--

      // Others
      if (assetType !== 'script') return priority
      priority--

      // JavaScript has lowest priority
      return priority
    })
  )
}
