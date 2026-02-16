export { parseVirtualFileId }
export { generateVirtualFileId }
export { virtualFileIdGlobalEntryServer }
export { virtualFileIdGlobalEntryClientSR }
export { virtualFileIdGlobalEntryClientCR }

import { extractAssetsRemoveQuery } from './extractAssetsQuery.js'
import { assert } from '../utils/assert.js'
import { assertIsNotBrowser } from '../utils/assertIsNotBrowser.js'
import { removeVirtualFileIdPrefix } from '../utils/virtualFileId.js'

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

// +middleware files
const virtualPlusMiddlewares = 'virtual:vike:+middlewares'

// Virtual ID prefixes
const virtualFileIdPageEntryPrefix =
  //
  'virtual:vike:page-entry:'
const virtualFileIdGlobalEntryPrefix =
  //
  'virtual:vike:global-entry:'

type VirtualFileIdEntryParsed =
  | { type: 'global-entry'; isForClientSide: boolean; isClientRouting: boolean }
  | { type: 'page-entry'; isForClientSide: boolean; pageId: string; isExtractAssets: boolean }
  | { type: 'plus-middlewares' }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(virtualFileIdGlobalEntryPrefix) && !id.startsWith(virtualFileIdPageEntryPrefix)) return false

  // Global entry
  if (id.includes(virtualFileIdGlobalEntryPrefix)) {
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

  // +middleware files
  if (id.startsWith(virtualPlusMiddlewares)) {
    return {
      type: 'plus-middlewares',
    }
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
    const pageIdSerialized = serializePageId(pageId)
    const id =
      `${isForClientSide ? virtualFileIdPageEntryClient : virtualFileIdPageEntryServer}${pageIdSerialized}` as const
    return id
  }
  assert(false)
}

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
