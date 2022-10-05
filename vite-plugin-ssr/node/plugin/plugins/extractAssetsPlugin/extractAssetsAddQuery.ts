export { extractAssetsAddQuery }

import { assert, getFileExtension } from '../../utils'

const query = 'extractAssets'

function extractAssetsAddQuery(id: string) {
  const fileExtension = getFileExtension(id)
  assert(fileExtension)
  if (id.includes('?')) {
    id = id.replace('?', `?${query}&`)
  } else {
    id = `${id}?${query}&lang.${fileExtension}`
  }
  return id
}
