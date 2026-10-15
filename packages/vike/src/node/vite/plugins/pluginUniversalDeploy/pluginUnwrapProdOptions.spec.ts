import { describe, it, expect } from 'vitest'
import { pluginUnwrapProdOptions } from './pluginUnwrapProdOptions.js'

// Applies the plugin's resolveId hook like Vite does: the handler only runs if the hook filter matches
function getResolveId(serverFilePath: string) {
  const plugin = pluginUnwrapProdOptions(serverFilePath)
  const { filter, handler } = plugin.resolveId as unknown as {
    filter: { id: RegExp[] }
    handler: (this: unknown, id: string, importer: string | undefined) => Promise<string | undefined>
  }
  // Like Vite's this.resolve(): the query is kept
  const context = { resolve: async (id: string) => ({ id }) }
  return async (id: string) => {
    if (!filter.id.some((re) => re.test(id))) return null
    return (await handler.call(context, id, undefined)) ?? null
  }
}

describe('pluginUnwrapProdOptions()', () => {
  it('wraps +server.js', async () => {
    const resolveId = getResolveId('/app/+server.ts')
    expect(await resolveId('/app/+server.ts')).toMatch(/^\/app\/\+server\.ts\?wrapper_\d+$/)
  })

  it("doesn't wrap the wrapper again", async () => {
    const resolveId = getResolveId('/app/+server.ts')
    const wrapped = await resolveId('/app/+server.ts')
    expect(wrapped).toBeTypeOf('string')
    // E.g. Universal Deploy's catch-all imports the wrapped module
    expect(await resolveId(wrapped!)).toBe(null)
  })
})
