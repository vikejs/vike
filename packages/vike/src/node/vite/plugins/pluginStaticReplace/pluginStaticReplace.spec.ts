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

    const input = readFileSync(join(__dirname, 'snapshot-vue-sfc-dev-before'), 'utf-8')

    const result = await transform(input, options)
    await expect(result!.code).toMatchFileSnapshot('./snapshot-vue-sfc-dev-after')
  })

  it('React', async () => {
    const options: TransformStaticReplaceOptions = {
      rules: [
        // jsx/jsxs/jsxDEV: children is a prop in arg 1
        {
          env: 'server',
          call: {
            match: {
              function: [
                'import:react/jsx-runtime:jsx',
                'import:react/jsx-runtime:jsxs',
                'import:react/jsx-dev-runtime:jsxDEV',
              ],
              args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
            },
            remove: { arg: 1, prop: 'children' },
          },
        },
        // createElement: children are rest args starting at index 2
        {
          env: 'server',
          call: {
            match: {
              function: 'import:react:createElement',
              args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
            },
            remove: { argsFrom: 2 },
          },
        },
        {
          env: 'server',
          call: {
            match: {
              function: 'import:vike-react/useHydrated:useHydrated',
            },
            replace: { with: false },
          },
        },
      ],
    }

    const input = readFileSync(join(__dirname, 'snapshot-befor-react'), 'utf-8')

    const result = await transform(input, options)
    await expect(result!.code).toMatchFileSnapshot('./snapshot-after-react')
  })
})
