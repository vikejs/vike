export { sortPageAssetsForEarlyHintsHeader }

import { higherFirst } from '../../utils.js'
import type { PageAsset } from '../getPageAssets.js'

async function sortPageAssetsForEarlyHintsHeader(pageAssets: PageAsset[], isProduction: boolean) {
  pageAssets.sort(
    higherFirst(({ assetType }) => {
      // In dev, we load scripts first in order to parallelize I/O and CPU
      if (!isProduction && assetType === 'script') {
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
      if (assetType === 'video') return priority
      priority--
      if (assetType === 'audio') return priority
      priority--

      // Others
      if (assetType !== 'script') return priority
      priority--

      // JavaScript has lowest priority
      return priority
    })
  )
}
