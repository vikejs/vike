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
  assertPosixPath(root)
  assertPosixPath(filePath)
  assert(root.startsWith('/'))
  assert(filePath.startsWith('/'))

  const manifestKey = getManifestKey(filePath, root)
  for (const manifest of manifests) {
    let manifestEntry = manifest[manifestKey]
    if (manifestEntry) {
      return { manifestEntry, manifest, manifestKey }
    }
  }

  const filePath_resolvedSymlink = resolveSymlink(filePath, root)
  const manifestKey_resolvedSymlink = getManifestKey(filePath_resolvedSymlink, root)
  for (const manifest of manifests) {
    let manifestEntry = manifest[manifestKey_resolvedSymlink]
    if (manifestEntry) {
      return { manifestEntry, manifest, manifestKey: manifestKey_resolvedSymlink }
    }
  }

  assert(optional, { manifestKey, filePath, manifestKey_resolvedSymlink, filePath_resolvedSymlink, manifestLength: manifests.length })
  return { manifestKey: manifestKey_resolvedSymlink, manifest: null, manifestEntry: null }
}

function getManifestKey(filePath: string, root: string) {
  let manifestKey = filePath
  if (filePath.startsWith('/@fs/')) {
    posix.relative(root, manifestKey.slice('/@fs'.length))
  }
  if (manifestKey.startsWith('/')) {
    manifestKey = manifestKey.slice(1)
  }
  return manifestKey
}

function resolveSymlink(filePath: string, root: string) {
  const filePathAbsolute = filePath.startsWith('/@fs/')
    ? filePath.slice('/@fs'.length)
    : `/${[...root.split('/'), ...filePath.split('/')].filter(Boolean).join('/')}`
  // Resolves symlinks
  const filePathResolved = require.resolve(filePathAbsolute)
  let filePathRelative = posix.relative(root, filePathResolved)
  assert(!filePathRelative.startsWith('/'))
  filePathRelative = '/' + filePathRelative
  return filePathRelative
}
