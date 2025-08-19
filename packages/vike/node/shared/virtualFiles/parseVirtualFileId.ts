export { parseVirtualFileId }
export { generateVirtualFileId }
export { virtualFileIdGlobalEntryServer }
export { virtualFileIdGlobalEntryClientSR }
export { virtualFileIdGlobalEntryClientCR }

import { extractAssetsRemoveQuery } from '../extractAssetsQuery.js'
import { assert, assertIsNotBrowser, removeVirtualFileIdPrefix } from '../utils.js'
assertIsNotBrowser()

const virtualFileIdGlobalEntryServer = 'virtual:vike:global-entry:server'
const virtualFileIdGlobalEntryClientSR = 'virtual:vike:global-entry:client:server-routing'
const virtualFileIdGlobalEntryClientCR = 'virtual:vike:global-entry:client:client-routing'
const virtualFileIdPageEntryClient = 'virtual:vike:page-entry:client:'
const virtualFileIdPageEntryServer = 'virtual:vike:page-entry:server:'

const virtualFileIdGlobalEntries = [
  virtualFileIdGlobalEntryServer,
  virtualFileIdGlobalEntryClientCR,
  virtualFileIdGlobalEntryClientSR,
]
const virtualFileIdPageEntryPrefix = 'virtual:vike:page-entry:'
const virtualFileIdGlobalEntryPrefix = 'virtual:vike:global-entry:'
assert(virtualFileIdGlobalEntries.every((v) => v.startsWith(virtualFileIdGlobalEntryPrefix)))

type VirtualFileIdEntryParsed =
  | { type: 'global'; isForClientSide: boolean; isClientRouting: boolean }
  | { type: 'page'; isForClientSide: boolean; pageId: string; isExtractAssets: boolean }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(virtualFileIdGlobalEntryPrefix) && !id.startsWith(virtualFileIdPageEntryPrefix)) return false

  // Check for page config lazy entries
  if (id.includes(virtualFileIdPageEntryPrefix)) {
    assert(id.startsWith(virtualFileIdPageEntryPrefix))
    const idOriginal = id
    id = extractAssetsRemoveQuery(id)
    const isExtractAssets = idOriginal !== id

    if (id.startsWith(virtualFileIdPageEntryClient)) {
      assert(isExtractAssets === false)
      return {
        type: 'page',
        pageId: id.slice(virtualFileIdPageEntryClient.length),
        isForClientSide: true,
        isExtractAssets,
      }
    }
    if (id.startsWith(virtualFileIdPageEntryServer)) {
      return {
        type: 'page',
        pageId: id.slice(virtualFileIdPageEntryServer.length),
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
    const id = `${isForClientSide ? virtualFileIdPageEntryClient : virtualFileIdPageEntryServer}${pageId}` as const
    return id
  }

  assert(false)
}
