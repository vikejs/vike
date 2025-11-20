export { parseVirtualFileId }
export { generateVirtualFileId }
export { virtualFileIdGlobalEntryServer }
export { virtualFileIdGlobalEntryClientSR }
export { virtualFileIdGlobalEntryClientCR }

import { extractAssetsRemoveQuery } from './extractAssetsQuery.js'
import { assert, assertIsNotBrowser, removeVirtualFileIdPrefix } from './utils.js'
assertIsNotBrowser()

// Global entries
const virtualFileIdGlobalEntryServer =
  //
  'virtual:vike:global-entry:server'
const virtualFileIdGlobalEntryClientSR =
  //
  'virtual:vike:global-entry:client:server-routing'
const virtualFileIdGlobalEntryClientCR =
  //
  'virtual:vike:global-entry:client:client-routing'

// Page entries
const virtualFileIdPageEntryClient =
  //
  'virtual:vike:page-entry:client:' // ${pageId}
const virtualFileIdPageEntryServer =
  //
  'virtual:vike:page-entry:server:' //  ${pageId}

// Virtual ID prefixes
const virtualFileIdPageEntryPrefix =
  //
  'virtual:vike:page-entry:'
const virtualFileIdGlobalEntryPrefix =
  //
  'virtual:vike:global-entry:'

const virtualFileIdGlobalEntries = [
  virtualFileIdGlobalEntryServer,
  virtualFileIdGlobalEntryClientCR,
  virtualFileIdGlobalEntryClientSR,
]
assert(
  virtualFileIdGlobalEntries.every((v) =>
    //
    v.startsWith(virtualFileIdGlobalEntryPrefix),
  ),
)
assert(
  [virtualFileIdPageEntryClient, virtualFileIdPageEntryServer].every((v) =>
    //
    v.startsWith(virtualFileIdPageEntryPrefix),
  ),
)

// Workaround:
// - We replace virtual:vike:page-entry:client:/ with virtual:vike:page-entry:client:ROOT
// - In order to avoid Vite to replace `virtual:vike:page-entry:client:/` with `virtual:vike:page-entry:client:`
// - I guess Vite/Rollup mistakenly treat the virtual ID as a path and tries to normalize id
const ROOT = 'ROOT'

function serializePageId(pageId: string): string {
  return pageId === '/' ? ROOT : pageId
}

function deserializePageId(pageId: string): string {
  return pageId === ROOT ? '/' : pageId
}

type VirtualFileIdEntryParsed =
  | { type: 'global-entry'; isForClientSide: boolean; isClientRouting: boolean }
  | { type: 'page-entry'; isForClientSide: boolean; pageId: string; isExtractAssets: boolean }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(virtualFileIdGlobalEntryPrefix) && !id.startsWith(virtualFileIdPageEntryPrefix)) return false

  // Global entry
  if (id.includes(virtualFileIdGlobalEntryPrefix)) {
    assert(virtualFileIdGlobalEntries.includes(id))
    const isForClientSide = id !== virtualFileIdGlobalEntryServer
    const isClientRouting = id === virtualFileIdGlobalEntryClientCR
    return {
      type: 'global-entry',
      isForClientSide,
      isClientRouting,
    }
  }

  // Page entry
  if (id.includes(virtualFileIdPageEntryPrefix)) {
    assert(id.startsWith(virtualFileIdPageEntryPrefix))
    const idOriginal = id
    id = extractAssetsRemoveQuery(id)
    const isExtractAssets = idOriginal !== id

    if (id.startsWith(virtualFileIdPageEntryClient)) {
      assert(isExtractAssets === false)
      const pageIdSerialized = id.slice(virtualFileIdPageEntryClient.length)
      const pageId = deserializePageId(pageIdSerialized)
      return {
        type: 'page-entry',
        pageId,
        isForClientSide: true,
        isExtractAssets,
      }
    }
    if (id.startsWith(virtualFileIdPageEntryServer)) {
      const pageIdSerialized = id.slice(virtualFileIdPageEntryServer.length)
      const pageId = deserializePageId(pageIdSerialized)
      return {
        type: 'page-entry',
        pageId,
        isForClientSide: false,
        isExtractAssets,
      }
    }
    assert(false)
  }

  return false
}

function generateVirtualFileId(
  args:
    | { type: 'global-entry'; isForClientSide: boolean; isClientRouting: boolean }
    | { type: 'page-entry'; pageId: string; isForClientSide: boolean },
): string {
  if (args.type === 'global-entry') {
    const { isForClientSide, isClientRouting } = args
    assert(typeof isClientRouting === 'boolean')
    if (!isForClientSide) {
      return virtualFileIdGlobalEntryServer
    } else if (isClientRouting) {
      return virtualFileIdGlobalEntryClientCR
    } else {
      return virtualFileIdGlobalEntryClientSR
    }
  }

  if (args.type === 'page-entry') {
    const { pageId, isForClientSide } = args
    assert(typeof pageId === 'string')
    const pageIdSerialized = serializePageId(pageId)
    const id = `${isForClientSide ? virtualFileIdPageEntryClient : virtualFileIdPageEntryServer}${pageIdSerialized}` as const
    return id
  }

  assert(false)
}
