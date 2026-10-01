import { pluginDistFileNames } from './pluginDistFileNames.js'
import { describe, it, expect } from 'vitest'

describe('pluginDistFileNames', () => {
  it("doesn't set the entry file names of other server environments", () => {
    const build = () => ({ assetsDir: 'assets', rollupOptions: {} })
    const config: any = {
      _viteVersionResolved: '7.3.1',
      environments: {
        ssr: { build: build() },
        rsc: { build: build() },
        vercel_client: { consumer: 'client', build: build() },
      },
    }
    const { configResolved } = pluginDistFileNames()[0]!
    ;(configResolved as any).handler(config)
    const { ssr, rsc, vercel_client } = config.environments
    expect(vercel_client.build.rollupOptions.output.entryFileNames).toBeTypeOf('function')
    expect(ssr.build.rollupOptions.output.entryFileNames({ name: 'index' })).toBe('index.mjs')
    expect(rsc.build.rollupOptions.output.entryFileNames).toBe(undefined)
    expect(rsc.build.rollupOptions.output.assetFileNames).toBeTypeOf('function')
  })
})
