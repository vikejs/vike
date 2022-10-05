export { extractAssetsAddQuery }

import { assert, getFileExtension } from '../../utils'

function extractAssetsAddQuery(id: string) {
  const fileExtension = getFileExtension(id)
  assert(fileExtension)
  return `${id}?extractAssets&lang.${fileExtension}`
}
