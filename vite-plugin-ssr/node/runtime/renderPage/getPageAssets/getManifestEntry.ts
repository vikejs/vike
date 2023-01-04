export { getManifestEntry }

import type { ViteManifest, ViteManifestEntry } from '../../helpers'
import { assert, slice, isNpmPackageModule } from '../../../utils'
import { assertClientEntryId } from './assertClientEntryId'

function getManifestEntry(
  id: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): { manifestKey: string; manifestEntry: ViteManifestEntry } {
  assertClientEntryId(id)

  // For vite-plugin-ssr client entry
  if (id.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(id, '@@vite-plugin-ssr'.length, 0)
    const { manifestKey, manifestEntry } = findEntryWithKeyEnd(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry && manifestKey, { id })
    return { manifestEntry, manifestKey }
  }

  // For user files
  if (id.startsWith('/')) {
    const manifestKey = id.slice(1)
    let manifestEntry = clientManifest[manifestKey]
    if (manifestEntry) {
      return { manifestEntry, manifestKey }
    }
  }

  // For extensions[number].pageFilesDist
  if (isNpmPackageModule(id)) {
    const manifestKey = manifestKeyMap[id]
    assert(manifestKey, { id })
    const manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry, { id, manifestKey })
    return { manifestEntry, manifestKey }
  }

  // For extensions[number].pageFilesSrc
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
      assert(manifestKeyEnd.startsWith('/'), { id })
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
