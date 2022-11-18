import type { ViteManifest, ViteManifestEntry } from './viteManifest'
import { assert, assertPosixPath, slice, isStemPackageName } from './utils'

export { getManifestEntry }

function getManifestEntry(
  id: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): null | { manifestKey: string; manifestEntry: ViteManifestEntry } {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), { id })
  assert(id.startsWith('@@vite-plugin-ssr/') || id.startsWith('/') || isStemPackageName(id), { id })

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

  // For Vilay and @brillout/docpress
  // TODO: deprecate this and migrate @brillout/docpress to Stem approach
  if (id.startsWith('/node_modules')) {
    let manifestKeyEnd = id.slice('/node_modules'.length)
    assert(manifestKeyEnd.startsWith('/'))
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
  }

  // For Stem packages
  assert(isStemPackageName(id))
  if (manifestKeyMap[id]) {
    const manifestKey = manifestKeyMap[id]!
    const manifestEntry = clientManifest[manifestKey]
    assert(manifestEntry)
    return { manifestEntry, manifestKey }
  }

  return null
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
