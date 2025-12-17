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
}
type ViteManifest = Record<string, ViteManifestEntry>
