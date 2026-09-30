import { describe, expect, it, vi } from 'vitest'
import { createLoadPageConfig } from './createLoadPageConfig.js'

describe('createLoadPageConfig()', () => {
  it('loads and resolves a page through the canonical serialized config path', async () => {
    const loadPageEntry = vi.fn(async () => ({
      configValuesSerialized: {
        Page: standard('page-value', '/pages/index/+Page.ts'),
        Layout: cumulative(['layout-inner', 'layout-outer'], ['/pages/index/+Layout.ts', '/pages/+Layout.ts']),
      },
    }))
    const loadPageConfig = createLoadPageConfig(
      false,
      async () => ({
        pageConfigsSerialized: [
          {
            pageId: '/index',
            routeFilesystem: { routeString: '/index', definedAtLocation: '/pages/index' },
            loadVirtualFilePageEntry: () => ({
              moduleId: 'virtual:vike:page-entry:worker:/index',
              moduleExportsPromise: loadPageEntry(),
            }),
            configValuesSerialized: {
              eager: standard('eager-value', '/pages/index/+config.ts'),
            },
          },
        ],
        pageConfigGlobalSerialized: {
          configValuesSerialized: {
            global: standard('global-value', '/pages/+config.ts'),
          },
        },
      }),
      false,
    )

    const pageConfig = await loadPageConfig('/index')
    expect(pageConfig.config).toMatchObject({
      Page: 'page-value',
      Layout: ['layout-inner', 'layout-outer'],
      eager: 'eager-value',
      global: 'global-value',
    })
    expect(pageConfig._source.Page).toMatchObject({
      type: 'configsStandard',
      definedAt: '/pages/index/+Page.ts',
    })

    await loadPageConfig('/index')
    expect(loadPageEntry).toHaveBeenCalledTimes(1)
  })

  it('rejects an unknown page ID', async () => {
    const loadPageConfig = createLoadPageConfig(
      false,
      async () => ({ pageConfigsSerialized: [], pageConfigGlobalSerialized: { configValuesSerialized: {} } }),
      false,
    )
    await expect(loadPageConfig('/missing')).rejects.toThrow('Unknown page ID')
  })

  it('returns an empty config when the environment has no config values', async () => {
    const loadPageConfig = createLoadPageConfig(false, async () => globalEntry(['/empty']), false)

    await expect(loadPageConfig('/empty')).resolves.toMatchObject({ config: {} })
  })

  it('caches the global entry only in production', async () => {
    const loadGlobalEntryProd = vi.fn(async () => globalEntry(['/a', '/b']))
    const loadPageConfigProd = createLoadPageConfig(false, loadGlobalEntryProd, false)
    await loadPageConfigProd('/a')
    await loadPageConfigProd('/b')
    expect(loadGlobalEntryProd).toHaveBeenCalledTimes(1)

    const loadGlobalEntryDev = vi.fn(async () => globalEntry(['/a', '/b']))
    const loadPageConfigDev = createLoadPageConfig(false, loadGlobalEntryDev, true)
    await loadPageConfigDev('/a')
    await loadPageConfigDev('/a')
    expect(loadGlobalEntryDev).toHaveBeenCalledTimes(2)
  })

  it.each([
    [true, [true, true]],
    [false, [false, false]],
    [['/a'], [true, false]],
  ])('Client Routing %j => loads the global entry of each page (%j)', async (clientRouting, expected) => {
    const loadGlobalEntry = vi.fn(async (_isClientRouting: boolean) => globalEntry(['/a', '/b']))
    const loadPageConfig = createLoadPageConfig(clientRouting, loadGlobalEntry, true)
    await loadPageConfig('/a')
    await loadPageConfig('/b')
    expect(loadGlobalEntry.mock.calls.map(([isClientRouting]) => isClientRouting)).toEqual(expected)
  })

  it('caches the global entry of each routing', async () => {
    const loadGlobalEntry = vi.fn(async (isClientRouting: boolean) =>
      globalEntry(isClientRouting ? ['/a'] : ['/b', '/c']),
    )
    const loadPageConfig = createLoadPageConfig(['/a'], loadGlobalEntry, false)
    for (const pageId of ['/a', '/b', '/c', '/a']) await loadPageConfig(pageId)
    expect(loadGlobalEntry.mock.calls.map(([isClientRouting]) => isClientRouting)).toEqual([true, false])
  })
})

function globalEntry(pageIds: string[]) {
  return {
    pageConfigsSerialized: pageIds.map((pageId) => ({
      pageId,
      routeFilesystem: { routeString: pageId, definedAtLocation: `/pages${pageId}` },
      loadVirtualFilePageEntry: () => ({
        moduleId: `virtual:vike:page-entry:rsc:${pageId}`,
        moduleExportsPromise: Promise.resolve({ configValuesSerialized: {} }),
      }),
      configValuesSerialized: {},
    })),
    pageConfigGlobalSerialized: { configValuesSerialized: {} },
  }
}

function standard(value: unknown, filePathToShowToUser: string) {
  return {
    type: 'standard' as const,
    definedAtData: { filePathToShowToUser, fileExportPathToShowToUser: [] },
    valueSerialized: { type: 'js-serialized' as const, value },
  }
}

function cumulative(values: unknown[], files: string[]) {
  return {
    type: 'cumulative' as const,
    definedAtData: files.map((filePathToShowToUser) => ({
      filePathToShowToUser,
      fileExportPathToShowToUser: [],
    })),
    valueSerialized: values.map((value) => ({ type: 'js-serialized' as const, value })),
  }
}
