import type { ViteManifest, ViteManifestEntry } from './getViteManifest'
import { assert, assertPosixPath, slice } from './utils'

export { getManifestEntry }

function getManifestEntry(
  id: string,
  clientManifest: ViteManifest,
): { manifestKey: string; manifestEntry: ViteManifestEntry } {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), { id })
  assert(id.startsWith('@@vite-plugin-ssr/') || id.startsWith('/'), { id })

  if (id.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(id, '@@vite-plugin-ssr'.length, 0)
    const { manifestKey, manifestEntry } = find(manifestKeyEnd, clientManifest, id)
    assert(manifestEntry && manifestKey, { id })
    return { manifestEntry, manifestKey }
  }

  {
    assert(id.startsWith('/'))
    const manifestKey = id.slice(1)
    let manifestEntry = clientManifest[manifestKey]
    if (manifestEntry) {
      return { manifestEntry, manifestKey }
    }
  }

  if (id.startsWith('/node_modules')) {
    let manifestKeyEnd = id.slice('/node_modules'.length)
    assert(manifestKeyEnd.startsWith('/'))
    {
      const { manifestEntry, manifestKey } = find(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey)
        return { manifestEntry, manifestKey }
      }
    }
    manifestKeyEnd = manifestKeyEnd.split('/').slice(1).join('/')
    assert(manifestKeyEnd.startsWith('/'))
    {
      const { manifestEntry, manifestKey } = find(manifestKeyEnd, clientManifest, id)
      if (manifestEntry) {
        assert(manifestKey)
        return { manifestEntry, manifestKey }
      }
    }
  }

  assert(false, { id })
}

function find(manifestKeyEnd: string, clientManifest: ViteManifest, id: string) {
  assert(manifestKeyEnd.startsWith('/'))
  let manifestEntry: ViteManifestEntry | null = null
  let manifestKey: string | null = null
  for (const manifestKey_ in clientManifest) {
    if (manifestKey_.endsWith(manifestKeyEnd)) {
      assert(!manifestEntry, { id })
      manifestEntry = clientManifest[manifestKey_]!
      manifestKey = manifestKey_
    }
  }
  return { manifestEntry, manifestKey }
}
