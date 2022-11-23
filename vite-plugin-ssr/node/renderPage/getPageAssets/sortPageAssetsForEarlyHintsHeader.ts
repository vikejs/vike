export { sortPageAssetsForEarlyHintsHeader }

import { higherFirst } from '../../utils'
import type { PageAsset } from '../getPageAssets'

function sortPageAssetsForEarlyHintsHeader(pageAssets: PageAsset[], pageContext: { _isProduction: boolean }) {
  pageAssets.sort(
    higherFirst(({ assetType }) => {
      // In dev, we load scripts first in order to parallelize I/O and CPU
      if (!pageContext._isProduction && assetType === 'script') {
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
