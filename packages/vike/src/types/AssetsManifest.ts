export type { AssetsManifest }
export type { AssetsManifestEntry }

import type { ManifestChunk } from 'vite'

type AssetsManifestEntry = ManifestChunk & {
  // Added by Vike: https://vike.dev/csp#sri
  integrity?: string
}
// dist/assets.json — Vite's client manifest, plus the props added by Vike
type AssetsManifest = Record<string, AssetsManifestEntry>
