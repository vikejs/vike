export { isFontFallback }

import type { PageAsset } from './getPageAssets.js'
import { assert } from '../../../utils/assert.js'

function isFontFallback(asset: PageAsset, earlyHints: PageAsset[]): boolean {
  if (asset.assetType !== 'font') {
    return false
  }
  const fontUrlBase = removeFileExtentionAndHash(asset.src)
  return earlyHints.some((hint) => {
    return hint.assetType === 'font' && removeFileExtentionAndHash(hint.src) === fontUrlBase
  })
}
function removeFileExtentionAndHash(assetUrl: string): string {
  assert(!assetUrl.includes('\\'))

  // The logic below doesn't work for '/assets/chunk-0e184ced.js'
  assert(!assetUrl.endsWith('.js'))

  const paths = assetUrl.split('/')
  {
    const filename = paths[paths.length - 1]!
    const filenameParts = filename.split('.')
    assert(filenameParts.length >= 2)
    // User may set config.build.rollupOptions.output.assetFileNames => we can't assume the filename to be `*.${hash}.${ext}`
    const filenameBase = filenameParts.slice(0, filenameParts.length === 2 ? -1 : -2)
    assert(filenameBase.length >= 1)
    paths[paths.length - 1] = filenameBase.join('.')
  }
  return paths.join('/')
}
