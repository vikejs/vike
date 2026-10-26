export type { AssetsManifest }
export type { AssetsManifestEntry }

type AssetsManifestEntry = {
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
type AssetsManifest = Record<string, AssetsManifestEntry>
