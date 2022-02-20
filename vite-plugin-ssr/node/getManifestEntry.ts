import { posix } from 'path'
import type { ViteManifest, ViteManifestEntry } from './getViteManifest'
import { assert, assertPosixPath } from './utils'

export { getManifestEntry }
//export type { ManifestEntry }

// prettier-ignore
type ManifestEntry         = { manifestKey: string; manifestEntry: ViteManifestEntry       ; manifest: ViteManifest       ; }
// prettier-ignore
type ManifestEntryOptional = { manifestKey: string; manifestEntry: ViteManifestEntry | null; manifest: ViteManifest | null; }

// prettier-ignore
function getManifestEntry(filePath: string, manifests: ViteManifest[], root: string, optional: false  ): ManifestEntry
// prettier-ignore
function getManifestEntry(filePath: string, manifests: ViteManifest[], root: string, optional: true   ): ManifestEntryOptional
// prettier-ignore
function getManifestEntry(filePath: string, manifests: ViteManifest[], root: string, optional: boolean): ManifestEntryOptional {
  assert(filePath.startsWith('/'))
  filePath = filePath.slice(1)
  const manifestKey1 = filePath
  for (const manifest of manifests) {
    let manifestEntry = manifest[manifestKey1]
    if (manifestEntry) {
      return { manifestEntry, manifest, manifestKey: manifestKey1 }
    }
  }
  const manifestKey2 = resolveSymlink(filePath, root)
  for (const manifest of manifests) {
    let manifestEntry = manifest[manifestKey2]
    if (manifestEntry) {
      return { manifestEntry, manifest, manifestKey: manifestKey2 }
    }
  }
  assert(optional, { manifestKey1, manifestKey2, manifestLength: manifests.length })
  return { manifestKey: manifestKey2, manifest: null, manifestEntry: null }
}

function resolveSymlink(filePath: string, root: string) {
  assertPosixPath(filePath)
  assertPosixPath(root)
  assert(!filePath.startsWith('/'))
  const filePathAbsolute = [...root.split('/'), ...filePath.split('/')].join('/')
  // Resolves symlinks
  const filePathResolved = require.resolve(filePathAbsolute)
  const filePathRelative = posix.relative(root, filePathResolved)
  assert(!filePathRelative.startsWith('/'))
  return filePathRelative
}
