import { describe, expect, it } from 'vitest'
import { invalidateVikeVirtualFiles } from './pluginVirtualFiles.js'

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
