export { parseVirtualFileId }
export { generateVirtualFileId }
export { virtualFileIdGlobalEntryServer }
export { virtualFileIdGlobalEntryClientSR }
export { virtualFileIdGlobalEntryClientCR }

import { extractAssetsRemoveQuery } from '../extractAssetsQuery.js'
import { assert, assertIsNotBrowser, removeVirtualFileIdPrefix } from '../utils.js'
assertIsNotBrowser()

// Virtual file ID patterns
const virtualFileIdGlobalEntryServer = 'virtual:vike:global-entry:server'
const virtualFileIdGlobalEntryClientSR = 'virtual:vike:global-entry:client:server-routing'
const virtualFileIdGlobalEntryClientCR = 'virtual:vike:global-entry:client:client-routing'
const virtualFileIdGlobalEntries = [
  virtualFileIdGlobalEntryServer,
  virtualFileIdGlobalEntryClientCR,
  virtualFileIdGlobalEntryClientSR,
]

// Page config lazy patterns (keeping old naming for backward compatibility)
const idBasePageConfigClient = 'virtual:vike:page-entry:client:'
const idBasePageConfigServer = 'virtual:vike:page-entry:server:'
const idBasePageConfig = 'virtual:vike:page-entry:'

const virtualFileIdGlobalEntryBase = 'virtual:vike:global-entry:'

// Ensure all global entry patterns start with the common base
assert(virtualFileIdGlobalEntries.every((v) => v.startsWith(`${virtualFileIdGlobalEntryBase}:`)))
// Note: Page config patterns use old naming for backward compatibility

type VirtualFileIdEntryParsed =
  | { type: 'global'; isForClientSide: boolean; isClientRouting: boolean }
  | { type: 'page'; isForClientSide: boolean; pageId: string; isExtractAssets: boolean }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(virtualFileIdGlobalEntryBase) && !id.startsWith(idBasePageConfig)) return false

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
  if (virtualFileIdGlobalEntries.includes(id)) {
    const isForClientSide = id !== virtualFileIdGlobalEntryServer
    const isClientRouting = id === virtualFileIdGlobalEntryClientCR
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
      return virtualFileIdGlobalEntryServer
    } else if (isClientRouting) {
      return virtualFileIdGlobalEntryClientCR
    } else {
      return virtualFileIdGlobalEntryClientSR
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
