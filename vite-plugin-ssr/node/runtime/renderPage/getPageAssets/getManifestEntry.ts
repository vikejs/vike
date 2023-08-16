export { getManifestEntry }

import type { ViteManifest, ViteManifestEntry } from '../../../shared/ViteManifest.js'
import { assert, slice, isNpmPackageImport } from '../../utils.js'
import { assertClientEntryId } from './assertClientEntryId.js'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode.js'

function getManifestEntry(
  id: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): { manifestKey: string; manifestEntry: ViteManifestEntry } {
  assertClientEntryId(id)
  const debugInfo = getDebugInfo(id, clientManifest)

  // VPS client entry
  if (id.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(id, '@@vite-plugin-ssr'.length, 0)
    const { manifestKey, manifestEntry } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry && manifestKey, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // Page code importer
  if (isVirtualFileIdImportPageCode(id)) {
    {
      const manifestKey = id
      const manifestEntry = clientManifest[manifestKey]
      if (manifestEntry) {
        return { manifestEntry, manifestKey }
      }
    }
    // Workaround for what seems to be a Vite bug when process.cwd() !== config.root
    //  - Manifest key is:
    //       ../../virtual:vite-plugin-ssr:importPageCode:client:/pages/index
    //    But it should be this instead:
    //      virtual:vite-plugin-ssr:importPageCode:client:/pages/index
    //  - This workaround was implemented to support Vitest runnung /tests/*
    //    - I don't know whether end users actually need this workaround? (I'm not sure what the bug actually is.)
    const manifestKeyEnd = id
    const { manifestKey, manifestEntry } = getEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // User files
  if (id.startsWith('/')) {
    const manifestKey = id.slice(1)
    let manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // extensions[number].pageConfigsDistFiles
  if (isNpmPackageImport(id)) {
    const manifestKey = manifestKeyMap[id]
    const debugInfo2 = { ...debugInfo, manifestKey }
    assert(manifestKey, debugInfo2)
    const manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry, debugInfo2)
    return { manifestEntry, manifestKey }
  }

  // extensions[number].pageConfigsSrcDir
  if (id.startsWith('/node_modules/') || id.startsWith('/../')) {
    let manifestKeyEnd = id.split('/node_modules/').slice(-1)[0]
    assert(manifestKeyEnd, debugInfo)
    assert(!manifestKeyEnd.startsWith('/'), debugInfo)
    manifestKeyEnd = '/' + manifestKeyEnd
    {
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey, debugInfo)
        return { manifestEntry, manifestKey }
      }
    }
    {
      assert(manifestKeyEnd.startsWith('/'), debugInfo)
      const dirS = manifestKeyEnd.split('/')
      assert(dirS[0] === '', debugInfo)
      manifestKeyEnd = '/' + dirS.slice(2).join('/')
      assert(manifestKeyEnd.startsWith('/'), debugInfo)
    }
    {
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey, debugInfo)
        return { manifestEntry, manifestKey }
      }
    }
    assert(false, debugInfo)
  }

  assert(false, debugInfo)
}

function findEntryWithKeyEnd(manifestKeyEnd: string, clientManifest: ViteManifest, id: string) {
  const debugInfo = getDebugInfo(id, clientManifest, manifestKeyEnd)
  assert(manifestKeyEnd.startsWith('/'), debugInfo)
  const manifestKeys: string[] = []
  for (const manifestKey in clientManifest) {
    if (manifestKey.endsWith(manifestKeyEnd)) {
      manifestKeys.push(manifestKey)
    }
  }
  const manifestKeysRelative = manifestKeys.filter((k) => k.startsWith('../'))
  assert(manifestKeysRelative.length <= 1, debugInfo)
  const manifestKey = manifestKeysRelative[0] ?? manifestKeys[0] ?? null
  if (!manifestKey) {
    return { manifestEntry: null, manifestKey: null }
  }
  const manifestEntry = clientManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}

function getEntryWithKeyEnd(manifestKeyEnd: string, clientManifest: ViteManifest, id: string) {
  const debugInfo = getDebugInfo(id, clientManifest, manifestKeyEnd)
  const manifestKeys: string[] = []
  for (const manifestKey in clientManifest) {
    if (manifestKey.endsWith(manifestKeyEnd)) {
      manifestKeys.push(manifestKey)
    }
  }
  assert(manifestKeys.length <= 1, debugInfo)
  const manifestKey = manifestKeys[0]
  if (!manifestKey) {
    return { manifestEntry: null, manifestKey: null }
  }
  const manifestEntry = clientManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}

function getDebugInfo(id: string, clientManifest: ViteManifest, manifestKeyEnd?: string) {
  const manifestKeys = Object.keys(clientManifest)
  if (manifestKeyEnd === undefined) {
    return { manifestKeys, id }
  } else {
    return { manifestKeys, manifestKeyEnd, id }
  }
}
