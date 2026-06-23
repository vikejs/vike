export { getTagScheme }
export type { TagScheme }

// A package's release-tag scheme, defined in one place so building a tag and recognizing one can't
// drift apart. `build` turns a version into its tag; `owns` reports whether a release tag is this
// package's — i.e. a candidate for deletion once its changelog entry is gone, never another package's
// release nor a tag we don't create (e.g. `nightly`).
//
// A single package keeps the historical bare `vX.Y.Z` tag. Several packages share the repo's tag
// namespace, so their tags are qualified with the package name (e.g. `create-vike-core@0.0.391`) to
// avoid collisions.
type TagScheme = {
  build(version: string): string
  owns(releaseTag: string): boolean
}
function getTagScheme(packageName: string, hasMultiplePackages: boolean): TagScheme {
  if (hasMultiplePackages) {
    const prefix = `${packageName}@`
    return {
      build: (version) => `${prefix}${version}`,
      owns: (releaseTag) => releaseTag.startsWith(prefix),
    }
  }
  return {
    build: (version) => `v${version}`,
    owns: (releaseTag) => /^v\d+\.\d+\.\d+/.test(releaseTag),
  }
}
