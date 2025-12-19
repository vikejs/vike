import { transformStaticReplace, TransformStaticReplaceOptions } from '../pluginStaticReplace.js'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const transform = (code: string, options: TransformStaticReplaceOptions) =>
  transformStaticReplace({ code, id: 'fake-id:pluginStaticReplace.spec.ts', options, env: 'server' })

describe('transformStaticReplace', () => {
  it('Vue', async () => {
    const options: TransformStaticReplaceOptions = {
      rules: [
        {
          env: 'server',
          call: {
            match: {
              function: ['import:vue/server-renderer:ssrRenderComponent'],
              args: {
                0: {
                  object: '$setup',
                  property: 'ClientOnly',
                },
              },
            },
            remove: { arg: 2, prop: 'default' },
          },
        },
      ],
    }

    const input = readFileSync(join(__dirname, 'vue-sfc-dev-fixture-before.js'), 'utf-8')
    const expected = readFileSync(join(__dirname, 'vue-sfc-dev-fixture-after.js'), 'utf-8')

    const result = await transform(input, options)

    // Check the transformation happened
    expect(result).toBeTruthy()
    expect(result?.code).toBeDefined()

    const code = result!.code

    // The key transformation: 'default' property should be removed from ClientOnly calls
    // Count how many times 'default: _withCtx' appears - should be 0 after transformation
    const defaultSlotMatches = code.match(/default:\s*_withCtx/g)
    expect(defaultSlotMatches).toBeNull() // All default slots should be removed

    // Verify fallback still exists in first call
    expect(code).toContain('fallback: _withCtx')

    // Verify both ClientOnly components are still called
    const clientOnlyCalls = code.match(/ClientOnly/g)
    expect(clientOnlyCalls).toBeTruthy()
    expect(clientOnlyCalls!.length).toBeGreaterThanOrEqual(4) // imports + 2 calls in code
  })
})
