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

    const result = await transform(input, options)

    expect(result).toBeTruthy()
    expect(result?.code).toMatchSnapshot()
  })
})
