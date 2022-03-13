import { posix } from 'path'
import type { ViteManifest, ViteManifestEntry } from './getViteManifest'
import { assert, assertPosixPath, toPosixPath, slice } from './utils'

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

  if( filePath.startsWith('@@vite-plugin-ssr/')) {
    const manifestKeyEnd = slice(filePath, '@@vite-plugin-ssr'.length, 0)
    let manifestEntry: ViteManifestEntry | null = null
    let manifestKey: string | null = null
    let manifest: ViteManifest | null = null
    for( const manifest_ of manifests) {
      for(const manifestKey_ in manifest_) {
        if( manifestKey_.endsWith(manifestKeyEnd) ) {
          assert(!manifestEntry, { filePath })
          manifestEntry = manifest_[manifestKey_]!
          manifestKey = manifestKey_
          manifest = manifest_
        }
      }
    }
    assert(manifestEntry && manifest && manifestKey, { filePath })
    return { manifestEntry, manifest, manifestKey }
  }

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

  assert(optional, { filePath, manifestKey, manifestKey_resolvedSymlink, filePath_resolvedSymlink, numberOfManifests: manifests.length })
  return { manifestKey: manifestKey_resolvedSymlink, manifest: null, manifestEntry: null }
}

function getManifestKey(filePath: string, root: string) {
  let manifestKey = filePath
  if (filePath.startsWith('/@fs/')) {
    manifestKey = posix.relative(root, manifestKey.slice('/@fs'.length))
  }
  if (manifestKey.startsWith('/')) {
    manifestKey = manifestKey.slice(1)
  }
  return manifestKey
}

function resolveSymlink(filePath: string, root: string) {
  const filePathAbsolute = filePath.startsWith('/@fs/')
    ? filePath.slice((isWindows() ? '/@fs/' : '/@fs').length)
    : [...root.split('/'), ...filePath.split('/')].join('/')
  // `require.resolve()` resolves symlinks
  const req = require // Prevent Webpack's dynamic import analysis
  const filePathResolved = toPosixPath(req.resolve(filePathAbsolute))
  let filePathRelative = posix.relative(root, filePathResolved)
  assert(!filePathRelative.startsWith('/'))
  filePathRelative = '/' + filePathRelative
  return filePathRelative
}

function isWindows() {
  return process.platform === 'win32'
}
