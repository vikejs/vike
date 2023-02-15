export { extractAssetsAddQuery }

// We import from node/utils.ts insead of node/plugin/utils.ts because this file is loaded by the server runtime
import { assert, getFileExtension } from '../../../../node/utils'

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
