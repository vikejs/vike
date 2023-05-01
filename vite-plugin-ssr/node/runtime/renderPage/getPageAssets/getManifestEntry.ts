export { getManifestEntry }

import type { ViteManifest, ViteManifestEntry } from '../../../shared/ViteManifest'
import { assert, slice, isNpmPackageModule } from '../../utils'
import { assertClientEntryId } from './assertClientEntryId'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode'

function getManifestEntry(
  id: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): { manifestKey: string; manifestEntry: ViteManifestEntry } {
  assertClientEntryId(id)

  // VPS client entry
  if (id.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(id, '@@vite-plugin-ssr'.length, 0)
    const { manifestKey, manifestEntry } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry && manifestKey, id)
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
    //    But should be instead:
    //      virtual:vite-plugin-ssr:importPageCode:client:/pages/index
    //  - This workaround was implemented to support Vitest runnung /tests/*
    //    - I don't know whether end users actually need this workaround? (I'm not sure what the bug actually is.)
    const manifestKeyEnd = id
    const { manifestKey, manifestEntry } = getEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry, id)
    return { manifestEntry, manifestKey }
  }

  // User files
  if (id.startsWith('/')) {
    const manifestKey = id.slice(1)
    let manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry, id)
    return { manifestEntry, manifestKey }
  }

  // extensions[number].plusConfigsDistFiles
  if (isNpmPackageModule(id)) {
    const manifestKey = manifestKeyMap[id]
    assert(manifestKey, id)
    const manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry, { id, manifestKey })
    return { manifestEntry, manifestKey }
  }

  // extensions[number].plusConfigsSrcDir
  if (id.startsWith('/node_modules/') || id.startsWith('/../')) {
    let manifestKeyEnd = id.split('/node_modules/').slice(-1)[0]
    assert(manifestKeyEnd, id)
    assert(!manifestKeyEnd.startsWith('/'))
    manifestKeyEnd = '/' + manifestKeyEnd
    {
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey)
        return { manifestEntry, manifestKey }
      }
    }
    {
      assert(manifestKeyEnd.startsWith('/'))
      const dirS = manifestKeyEnd.split('/')
      assert(dirS[0] === '')
      manifestKeyEnd = '/' + dirS.slice(2).join('/')
      assert(manifestKeyEnd.startsWith('/'), id)
    }
    {
      const { manifestEntry, manifestKey } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey)
        return { manifestEntry, manifestKey }
      }
    }
    assert(false, id)
  }

  assert(false, id)
}

function findEntryWithKeyEnd(manifestKeyEnd: string, clientManifest: ViteManifest, id: string) {
  assert(manifestKeyEnd.startsWith('/'))
  const manifestKeys: string[] = []
  for (const manifestKey in clientManifest) {
    if (manifestKey.endsWith(manifestKeyEnd)) {
      manifestKeys.push(manifestKey)
    }
  }
  const manifestKeysRelative = manifestKeys.filter((k) => k.startsWith('../'))
  assert(manifestKeysRelative.length <= 1, { id })
  const manifestKey = manifestKeysRelative[0] ?? manifestKeys[0] ?? null
  if (!manifestKey) {
    return { manifestEntry: null, manifestKey: null }
  }
  const manifestEntry = clientManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}

function getEntryWithKeyEnd(manifestKeyEnd: string, clientManifest: ViteManifest, id: string) {
  const manifestKeys: string[] = []
  for (const manifestKey in clientManifest) {
    if (manifestKey.endsWith(manifestKeyEnd)) {
      manifestKeys.push(manifestKey)
    }
  }
  assert(manifestKeys.length <= 1, id)
  const manifestKey = manifestKeys[0]
  if (!manifestKey) {
    return { manifestEntry: null, manifestKey: null }
  }
  const manifestEntry = clientManifest[manifestKey]!
  return { manifestEntry, manifestKey }
}
