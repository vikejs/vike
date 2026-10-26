export type { ViteManifest }
export type { ViteManifestEntry }

type ViteManifestEntry = {
  src?: string
  file: string
  css?: string[]
  assets?: string[]
  isEntry?: boolean
  name?: string
  isDynamicEntry?: boolean
  imports?: string[]
  dynamicImports?: string[]
  // Added by Vike: https://vike.dev/csp#sri
  integrity?: string
}
type ViteManifest = Record<string, ViteManifestEntry>
