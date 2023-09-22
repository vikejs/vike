export { extractAssetsAddQuery }
export { extractAssetsRemoveQuery }

// We import from node/utils.ts insead of node/plugin/utils.ts because this file is loaded by the server runtime
import { assert, getFileExtension } from './utils.js'

const query = 'extractAssets'

function extractAssetsAddQuery(id: string): string {
  const fileExtension = getFileExtension(id)
  assert(fileExtension || id.includes('virtual:vike:'))
  if (!fileExtension) return `${id}?${query}`
  if (id.includes('?')) {
    id = id.replace('?', `?${query}&`)
  } else {
    id = `${id}?${query}&lang.${fileExtension}`
  }
  return id
}

function extractAssetsRemoveQuery(id: string): string {
  if (!id.includes('?')) return id
  const suffix = `?${query}`
  // Only supports 'virtual:vike:' IDs
  assert(id.endsWith(query))
  return id.slice(0, -1 * suffix.length)
}
