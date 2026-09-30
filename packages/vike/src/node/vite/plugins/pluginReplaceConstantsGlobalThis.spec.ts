import { describe, expect, it } from 'vitest'
import {
  pluginReplaceConstantsGlobalThis,
  VIRTUAL_FILE_ID_constantsGlobalThis,
} from './pluginReplaceConstantsGlobalThis.js'
import { assert } from '../../../utils/assert.js'

describe('pluginReplaceConstantsGlobalThis resolveId()', () => {
  const getResolveId = () => {
    const plugin = pluginReplaceConstantsGlobalThis().find(
      (p) => p.name === 'vike:pluginReplaceConstantsGlobalThis:virtual-file',
    )
    assert(plugin)
    const { resolveId } = plugin
    assert(resolveId && typeof resolveId === 'object')
    const { filter, handler } = resolveId
    const include = filter?.id && typeof filter.id === 'object' && 'include' in filter.id ? filter.id.include : null
    assert(include instanceof RegExp)
    const resolve = (id: string) => {
      // Vite calls the handler only for the IDs that match the filter
      expect(include.test(id)).toBe(true)
      return (handler as (id: string) => unknown).call({}, id)
    }
    return resolve
  }
  const resolved = `\0${VIRTUAL_FILE_ID_constantsGlobalThis}`

  it('resolves the import', () => {
    expect(getResolveId()(VIRTUAL_FILE_ID_constantsGlobalThis)).toBe(resolved)
  })

  // Vite re-resolves the already-resolved ID after @vitejs/plugin-rsc calls addWatchFile() on it
  it('resolves the resolved ID', () => {
    expect(getResolveId()(resolved)).toBe(resolved)
  })
  it('resolves the URL of the resolved ID', () => {
    expect(getResolveId()(`/@id/__x00__${VIRTUAL_FILE_ID_constantsGlobalThis}`)).toBe(resolved)
  })

  it('rejects any other ID', () => {
    expect(() => getResolveId()(`/some/dir/${VIRTUAL_FILE_ID_constantsGlobalThis}`)).toThrow()
  })
})
