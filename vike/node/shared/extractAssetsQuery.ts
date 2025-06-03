export { extractAssetsAddQuery }
export { extractAssetsRemoveQuery }

// We import from node/utils.ts insead of node/vite/utils.ts because this file is loaded by the server runtime
import { assert, getFileExtension } from './utils.js'

const query = 'extractAssets'

function extractAssetsAddQuery(id: string): string {
  const fileExtension = getFileExtension(id)
  if (!fileExtension || id.includes('virtual:vike:')) {
    return `${id}?${query}`
  } else {
    if (!id.includes('?')) {
      return `${id}?${query}&lang.${fileExtension}`
    } else {
      return id.replace('?', `?${query}&`)
    }
  }
}

function extractAssetsRemoveQuery(id: string): string {
  if (!id.includes('?')) return id
  const suffix = `?${query}`
  // Only supports 'virtual:vike:' IDs
  assert(id.endsWith(query))
  return id.slice(0, -1 * suffix.length)
}
