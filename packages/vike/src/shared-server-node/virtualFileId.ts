export { parseVirtualFileId }
export { generateVirtualFileId }
export { generateVirtualFileIdAdditionalEnvironment }
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

// Virtual ID prefixes
const virtualFileIdPageEntryPrefix =
  //
  'virtual:vike:page-entry:'
const virtualFileIdGlobalEntryPrefix =
  //
  'virtual:vike:global-entry:'

type VirtualFileIdEntryParsed =
  | {
      type: 'global-entry'
      environmentName: string
      isClientRouting: boolean
    }
  | {
      type: 'page-entry'
      environmentName: string
      pageId: string
      isExtractAssets: boolean
    }

function parseVirtualFileId(id: string): false | VirtualFileIdEntryParsed {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(virtualFileIdGlobalEntryPrefix) && !id.startsWith(virtualFileIdPageEntryPrefix)) return false

  // Global entry
  if (id.includes(virtualFileIdGlobalEntryPrefix)) {
    const isClientRouting = id === virtualFileIdGlobalEntryClientCR
    const environmentName = parseGlobalEntryEnvironmentName(id)
    return {
      type: 'global-entry',
      environmentName,
      isClientRouting,
    }
  }

  // Page entry
  if (id.includes(virtualFileIdPageEntryPrefix)) {
    const idOriginal = id
    id = extractAssetsRemoveQuery(id)
    const isExtractAssets = idOriginal !== id
    const environmentNameBegin = virtualFileIdPageEntryPrefix.length
    const environmentNameEnd = id.indexOf(':', environmentNameBegin)
    assert(environmentNameEnd > environmentNameBegin)
    const environmentName = id.slice(environmentNameBegin, environmentNameEnd)
    const pageIdSerialized = id.slice(environmentNameEnd + 1)
    const pageId = deserializePageId(pageIdSerialized)
    if (environmentName === 'client') assert(isExtractAssets === false)
    return {
      type: 'page-entry',
      environmentName,
      pageId,
      isExtractAssets,
    }
  }

  return false
}

function parseGlobalEntryEnvironmentName(id: string) {
  if (id === virtualFileIdGlobalEntryServer) return 'server'
  if (id === virtualFileIdGlobalEntryClientSR || id === virtualFileIdGlobalEntryClientCR) return 'client'
  const environmentName = id.slice(virtualFileIdGlobalEntryPrefix.length)
  assertEnvironmentName(environmentName)
  return environmentName
}

function generateVirtualFileId(
  args:
    | { type: 'global-entry'; environmentName: string; isClientRouting?: boolean }
    | { type: 'page-entry'; pageId: string; environmentName: string },
): string {
  if (args.type === 'global-entry') {
    const { environmentName, isClientRouting } = args
    assertEnvironmentName(environmentName)
    if (environmentName === 'client') {
      return isClientRouting ? virtualFileIdGlobalEntryClientCR : virtualFileIdGlobalEntryClientSR
    }
    assert(!isClientRouting)
    if (environmentName === 'server') return virtualFileIdGlobalEntryServer
    return `${virtualFileIdGlobalEntryPrefix}${environmentName}`
  }
  if (args.type === 'page-entry') {
    const { pageId, environmentName } = args
    const pageIdSerialized = serializePageId(pageId)
    assertEnvironmentName(environmentName)
    return `${virtualFileIdPageEntryPrefix}${environmentName}:${pageIdSerialized}`
  }
  assert(false)
}

// The global entry of an additional environment (e.g. `rsc`)
function generateVirtualFileIdAdditionalEnvironment(environmentName: string) {
  // TODO: ai assert(isEnvironmentBuiltIn(environmentName))
  assert(environmentName !== 'server' && environmentName !== 'client')
  return generateVirtualFileId({ type: 'global-entry', environmentName })
}

function assertEnvironmentName(environmentName: string) {
  assert(environmentName && !environmentName.includes(':'))
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
