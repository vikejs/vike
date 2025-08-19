export { getManifestEntry }

import type { ViteManifest, ViteManifestEntry } from '../../../../types/ViteManifest.js'
import { assert, slice, assertIsImportPathNpmPackage } from '../../utils.js'
import { parseVirtualFileId } from '../../../shared/virtualFiles/parseVirtualFileId.js'
import { prependEntriesDir } from '../../../shared/prependEntriesDir.js'

function getManifestEntry(
  id: string,
  assetsManifest: ViteManifest,
): { manifestKey: string; manifestEntry: ViteManifestEntry } {
  const debugInfo = getDebugInfo(id, assetsManifest)

  // Vike client entry
  if (id.startsWith('@@vike/')) {
    const manifestKeyEnd = slice(id, '@@vike'.length, 0)
    const { manifestKey, manifestEntry } = findEntryWithKeyEnd(manifestKeyEnd, assetsManifest, id)
    assert(manifestEntry && manifestKey, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // Page code importer
  const virtualFile = parseVirtualFileId(id)
  if (virtualFile && virtualFile.type === 'page-entry') {
    {
      const manifestKey = id
      const manifestEntry = assetsManifest[manifestKey]
      if (manifestEntry) {
        return { manifestEntry, manifestKey }
      }
    }
    // Workaround for what seems to be a Vite bug when process.cwd() !== config.root
    //  - Manifest key is:
    //       ../../virtual:vike:page-entry:client:/pages/index
    //    But it should be this instead:
    //      virtual:vike:page-entry:client:/pages/index
    //  - This workaround was implemented to support Vitest running /tests/*
    //    - I don't know whether end users actually need this workaround? (I'm not sure what the bug actually is.)
    const manifestKeyEnd = id
    const { manifestKey, manifestEntry } = getEntryWithKeyEnd(manifestKeyEnd, assetsManifest, id)
    assert(manifestEntry, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // User files
  if (id.startsWith('/')) {
    const manifestKey = id.slice(1)
    let manifestEntry = assetsManifest[manifestKey]
    assert(manifestEntry, debugInfo)
    return { manifestEntry, manifestKey }
  }

  // npm package import
  assertIsImportPathNpmPackage(id)
  const found = Object.entries(assetsManifest).find(([, e]) => e.name === prependEntriesDir(id))
  assert(found)
  const [manifestKey, manifestEntry] = found
  return { manifestEntry, manifestKey }

  /* Can we remove this?
  // extensions[number].pageConfigsSrcDir
  if (id.startsWith('/node_modules/') || id.startsWith('/../')) {
    let manifestKeyEnd = id.split('/node_modules/').slice(-1)[0]
    assert(manifestKeyEnd, debugInfo)
    assert(!manifestKeyEnd.startsWith('/'), debugInfo)
    manifestKeyEnd = '/' + manifestKeyEnd
    {
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, assetsManifest, id)
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
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, assetsManifest, id)
      if (manifestEntry) {
        assert(manifestKey, debugInfo)
        return { manifestEntry, manifestKey }
      }
    }
    assert(false, debugInfo)
  }
  */
}

function findEntryWithKeyEnd(manifestKeyEnd: string, assetsManifest: ViteManifest, id: string) {
  const debugInfo = getDebugInfo(id, assetsManifest, manifestKeyEnd)
  assert(manifestKeyEnd.startsWith('/'), debugInfo)
  const manifestKeys: string[] = []
  for (const manifestKey in assetsManifest) {
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
  const manifestEntry = assetsManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}

function getEntryWithKeyEnd(manifestKeyEnd: string, assetsManifest: ViteManifest, id: string) {
  const debugInfo = getDebugInfo(id, assetsManifest, manifestKeyEnd)
  const manifestKeys: string[] = []
  for (const manifestKey in assetsManifest) {
    if (manifestKey.endsWith(manifestKeyEnd)) {
      manifestKeys.push(manifestKey)
    }
  }
  assert(manifestKeys.length <= 1, debugInfo)
  const manifestKey = manifestKeys[0]
  if (!manifestKey) {
    return { manifestEntry: null, manifestKey: null }
  }
  const manifestEntry = assetsManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}

function getDebugInfo(id: string, assetsManifest: ViteManifest, manifestKeyEnd?: string) {
  const manifestKeys = Object.keys(assetsManifest)
  if (manifestKeyEnd === undefined) {
    return { manifestKeys, id }
  } else {
    return { manifestKeys, manifestKeyEnd, id }
  }
}
