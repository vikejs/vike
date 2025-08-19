export { parseVirtualFileId }
export { generateVirtualFileId }
export { virtualFileIdEntryServer }
export { virtualFileIdEntryClientSR }
export { virtualFileIdEntryClientCR }

import { extractAssetsRemoveQuery } from '../extractAssetsQuery.js'
import { assert, assertIsNotBrowser, removeVirtualFileIdPrefix } from '../utils.js'
assertIsNotBrowser()

// Virtual file ID patterns
const virtualFileIdEntryServer = 'virtual:vike:entry:server'
const virtualFileIdEntryClientSR = 'virtual:vike:entry:client:server-routing'
const virtualFileIdEntryClientCR = 'virtual:vike:entry:client:client-routing'
const virtualFileIdEntries = [virtualFileIdEntryServer, virtualFileIdEntryClientCR, virtualFileIdEntryClientSR]

// Page config lazy patterns (keeping old naming for backward compatibility)
const idBasePageConfigClient = 'virtual:vike:pageConfigLazy:client:'
const idBasePageConfigServer = 'virtual:vike:pageConfigLazy:server:'
const idBasePageConfig = 'virtual:vike:pageConfigLazy:'

// Common base for all entry types
const idBaseEntry = 'virtual:vike:entry'

// Ensure all global entry patterns start with the common base
assert(virtualFileIdEntries.every((v) => v.startsWith(`${idBaseEntry}:`)))
// Note: Page config patterns use old naming for backward compatibility

type VirtualFileIdEntryParsed =
  | { type: 'global'; isForClientSide: boolean; isClientRouting: boolean }
  | { type: 'page'; isForClientSide: boolean; pageId: string; isExtractAssets: boolean }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(idBaseEntry) && !id.startsWith(idBasePageConfig)) return false

  // Check for page config lazy entries
  if (id.includes(idBasePageConfig)) {
    assert(id.startsWith(idBasePageConfig))
    const idOriginal = id
    id = extractAssetsRemoveQuery(id)
    const isExtractAssets = idOriginal !== id

    if (id.startsWith(idBasePageConfigClient)) {
      assert(isExtractAssets === false)
      return {
        type: 'page',
        pageId: id.slice(idBasePageConfigClient.length),
        isForClientSide: true,
        isExtractAssets,
      }
    }
    if (id.startsWith(idBasePageConfigServer)) {
      return {
        type: 'page',
        pageId: id.slice(idBasePageConfigServer.length),
        isForClientSide: false,
        isExtractAssets,
      }
    }
    assert(false)
  }

  // Check for global entry files
  if (virtualFileIdEntries.includes(id)) {
    const isForClientSide = id !== virtualFileIdEntryServer
    const isClientRouting = id === virtualFileIdEntryClientCR
    return {
      type: 'global',
      isForClientSide,
      isClientRouting,
    }
  }

  return false
}

function generateVirtualFileId(type: 'global', options: { isForClientSide: boolean; isClientRouting: boolean }): string
function generateVirtualFileId(type: 'page', options: { pageId: string; isForClientSide: boolean }): string
function generateVirtualFileId(
  type: 'global' | 'page',
  options: { isForClientSide: boolean; isClientRouting?: boolean; pageId?: string },
): string {
  if (type === 'global') {
    const { isForClientSide, isClientRouting } = options
    assert(typeof isClientRouting === 'boolean')
    if (!isForClientSide) {
      return virtualFileIdEntryServer
    } else if (isClientRouting) {
      return virtualFileIdEntryClientCR
    } else {
      return virtualFileIdEntryClientSR
    }
  }

  if (type === 'page') {
    const { pageId, isForClientSide } = options
    assert(typeof pageId === 'string')
    const id = `${isForClientSide ? idBasePageConfigClient : idBasePageConfigServer}${pageId}` as const
    return id
  }

  assert(false)
}
