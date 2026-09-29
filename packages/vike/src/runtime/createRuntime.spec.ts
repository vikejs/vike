import { describe, expect, it, vi } from 'vitest'
import { createRuntime } from './createRuntime.js'

describe('createRuntime()', () => {
  it('loads and resolves a page through the canonical serialized config path', async () => {
    const loadPageEntry = vi.fn(async () => ({
      configValuesSerialized: {
        Page: standard('page-value', '/pages/index/+Page.ts'),
        Layout: cumulative(['layout-inner', 'layout-outer'], ['/pages/index/+Layout.ts', '/pages/+Layout.ts']),
      },
    }))
    const loadPageConfig = createRuntime(
      [
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
      {
        configValuesSerialized: {
          global: standard('global-value', '/pages/+config.ts'),
        },
      },
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
    const loadPageConfig = createRuntime([], { configValuesSerialized: {} }, false)
    await expect(loadPageConfig('/missing')).rejects.toThrow('Unknown page ID')
  })

  it('returns an empty config when the environment has no config values', async () => {
    const loadPageConfig = createRuntime(
      [
        {
          pageId: '/empty',
          routeFilesystem: { routeString: '/empty', definedAtLocation: '/pages/empty' },
          loadVirtualFilePageEntry: () => ({
            moduleId: 'virtual:vike:page-entry:empty:/empty',
            moduleExportsPromise: Promise.resolve({ configValuesSerialized: {} }),
          }),
          configValuesSerialized: {},
        },
      ],
      { configValuesSerialized: {} },
      false,
    )

    await expect(loadPageConfig('/empty')).resolves.toMatchObject({ config: {} })
  })
})

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
