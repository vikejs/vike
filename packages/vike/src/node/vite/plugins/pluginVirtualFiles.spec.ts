import { describe, expect, it } from 'vitest'
import { resolveConfig, type Alias } from 'vite'
import { invalidateVikeVirtualFiles, pluginVirtualFiles, runtimeAlias } from './pluginVirtualFiles.js'
import { assert } from '../../../utils/assert.js'

describe('`vike/runtime` alias', () => {
  const getRuntimePlugin = () => {
    const plugin = pluginVirtualFiles().find((p) => p.name === 'vike:pluginVirtualFiles:runtime')
    assert(plugin)
    return plugin
  }

  it('is added to the top-level `resolve.alias`, which applies to every environment', async () => {
    const config = await resolveConfig(
      {
        configFile: false,
        logLevel: 'silent',
        plugins: [getRuntimePlugin()],
        environments: { rsc: { consumer: 'server' } },
      },
      'serve',
    )
    expect(config.resolve.alias as Alias[]).toContainEqual(runtimeAlias)
    expect(Object.keys(config.environments).sort()).toEqual(['client', 'rsc', 'ssr'])
    Object.values(config.environments).forEach((environment) => {
      expect(environment.resolve.alias as Alias[]).toContainEqual(runtimeAlias)
    })
  })

  it('matches only `vike/runtime` and maps it onto itself', () => {
    const { find, replacement } = runtimeAlias
    assert(find instanceof RegExp)
    expect(find.test('vike/runtime')).toBe(true)
    expect('vike/runtime'.replace(find, replacement)).toBe('vike/runtime')
    expect(find.test('vike/runtime/foo')).toBe(false)
    expect(find.test('vike/runtimeX')).toBe(false)
    expect(find.test('my-lib/vike/runtime')).toBe(false)
    expect(find.test('vike/server')).toBe(false)
  })
})

describe('invalidateVikeVirtualFiles()', () => {
  it("invalidates Vike's virtual files in every environment, including their module runners", () => {
    const invalidated: string[] = []
    const getEnvironment = (name: string, withRunner: boolean) => {
      const ids = [
        '\0virtual:vike:global-entry:rsc',
        '\0virtual:vike:page-entry:rsc:/index',
        '/app/pages/index/+Page.js',
      ]
      const moduleGraph = {
        idToModuleMap: new Map(ids.map((id) => [id, { id }])),
        invalidateModule: (mod: { id: string }) => invalidated.push(`${name}:graph:${mod.id}`),
      }
      const runner = {
        evaluatedModules: {
          idToModuleMap: new Map(ids.map((id) => [id, { id }])),
          invalidateModule: (mod: { id: string }) => invalidated.push(`${name}:runner:${mod.id}`),
        },
      }
      return withRunner ? { moduleGraph, runner } : { moduleGraph }
    }
    const server = {
      moduleGraph: { urlToModuleMap: new Map() },
      environments: { client: getEnvironment('client', false), rsc: getEnvironment('rsc', true) },
    } as unknown as Parameters<typeof invalidateVikeVirtualFiles>[0]
    invalidateVikeVirtualFiles(server)
    expect(invalidated).toEqual([
      'client:graph:\0virtual:vike:global-entry:rsc',
      'client:graph:\0virtual:vike:page-entry:rsc:/index',
      'rsc:graph:\0virtual:vike:global-entry:rsc',
      'rsc:graph:\0virtual:vike:page-entry:rsc:/index',
      'rsc:runner:\0virtual:vike:global-entry:rsc',
      'rsc:runner:\0virtual:vike:page-entry:rsc:/index',
    ])
  })
})
