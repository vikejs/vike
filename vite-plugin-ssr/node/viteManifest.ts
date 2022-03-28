import { assert, isPlainObject } from './utils'

export { assertViteManifest }

export type { ViteManifest }
export type { ViteManifestEntry }

type ViteManifestEntry = {
  src?: string
  file: string
  css?: string[]
  assets?: string[]
  isEntry?: boolean
  isDynamicEntry?: boolean
  imports?: string[]
  dynamicImports?: string[]
}
type ViteManifest = Record<string, ViteManifestEntry>

function assertViteManifest(manifest: unknown): asserts manifest is ViteManifest {
  assert(isPlainObject(manifest))
  Object.values(manifest).forEach((entry) => {
    assert(isPlainObject(entry))
    assert(typeof entry.file === 'string')
  })
}
