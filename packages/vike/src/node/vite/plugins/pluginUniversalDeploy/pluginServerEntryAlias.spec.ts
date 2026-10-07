import { describe, it, expect, vi } from 'vitest'
import { catchAllEntry } from '@universal-deploy/store'
import { pluginServerEntryAlias } from './pluginServerEntryAlias.js'

type Hook = { filter: { id: { include: RegExp[] } }; handler: (id: string) => unknown }

function getHooks(serverFilePath: string | null) {
  const plugin = pluginServerEntryAlias(serverFilePath)
  const resolveIdHook = plugin.resolveId as unknown as Hook
  const loadHook = plugin.load as unknown as Hook
  // Apply the hook filter, as Vite/Rolldown does
  const call = (hook: Hook, id: string) => (hook.filter.id.include.some((r) => r.test(id)) ? hook.handler(id) : null)
  return {
    resolveId: (id: string) => call(resolveIdHook, id),
    load: (id: string) => call(loadHook, id),
  }
}

describe('pluginServerEntryAlias()', () => {
  it('vike:server', () => {
    const { resolveId, load } = getHooks('/app/pages/+server.ts')
    expect(resolveId('vike:server')).toBe('\0vike:server')
    expect(load('\0vike:server')).toMatchInlineSnapshot(`
      "import mod from "virtual:ud:catch-all";

      export * from "/app/pages/+server.ts";
      export default mod;
      "
    `)
    // Without +server.js
    expect(getHooks(null).resolveId('vike:server')).toBe(catchAllEntry)
  })

  it('vike:server-entry (deprecated)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const { resolveId } = getHooks('/app/pages/+server.ts')
      expect(resolveId('vike:server-entry')).toBe('\0vike:server')
      expect(getHooks(null).resolveId('vike:server-entry')).toBe(catchAllEntry)
      // Warns only once
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
        [
          "[vike][Warning] vike:server-entry is deprecated in favor of vike:server, e.g. replace "main": "vike:server-entry" with "main": "vike:server" in your wrangler.jsonc",
        ]
      `)
    } finally {
      warn.mockRestore()
    }
  })

  it('the hook filters ignore other IDs', () => {
    const { resolveId, load } = getHooks('/app/pages/+server.ts')
    for (const id of ['virtual:vike:server:constantsGlobalThis', 'vike:server-entry2', 'vike', 'vike/server']) {
      expect(resolveId(id)).toBe(null)
      expect(load(id)).toBe(null)
    }
  })
})
