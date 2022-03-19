import type { ViteManifest, ViteManifestEntry } from './getViteManifest'
import { assert, assertPosixPath, slice } from './utils'

export { getManifestEntry }

// prettier-ignore
type ManifestEntry         = { manifestKey: string; manifestEntry: ViteManifestEntry        }
// prettier-ignore
type ManifestEntryOptional = { manifestKey: string; manifestEntry: ViteManifestEntry | null }

// prettier-ignore
function getManifestEntry(id: string, clientManifest: ViteManifest, optional: false  ): ManifestEntry
// prettier-ignore
function getManifestEntry(id: string, clientManifest: ViteManifest, optional: true   ): ManifestEntryOptional
// prettier-ignore
function getManifestEntry(id: string, clientManifest: ViteManifest, optional: boolean): ManifestEntryOptional {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), { id })

  if( id.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(id, '@@vite-plugin-ssr'.length, 0)
    let manifestEntry: ViteManifestEntry | null = null
    let manifestKey: string | null = null
      for(const manifestKey_ in clientManifest) {
        if( manifestKey_.endsWith(manifestKeyEnd) ) {
          assert(!manifestEntry, { id })
          manifestEntry = clientManifest[manifestKey_]!
          manifestKey = manifestKey_
        }
    }
    assert(manifestEntry && manifestKey, { id })
    return { manifestEntry, manifestKey }
  }

  const manifestKey = getManifestKey(id)
  let manifestEntry = clientManifest[manifestKey]
  if (manifestEntry) {
    return { manifestEntry, manifestKey }
  }

  assert(optional, { id, manifestKey })
  return { manifestKey, manifestEntry: null }
}

function getManifestKey(filePath: string) {
  let manifestKey = filePath
  if (manifestKey.startsWith('/')) {
    manifestKey = manifestKey.slice(1)
  }
  return manifestKey
}
