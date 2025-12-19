import { transformStaticReplace, TransformStaticReplaceOptions } from '../pluginStaticReplace.js'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const optionsReact: TransformStaticReplaceOptions = {
  rules: [
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

const optionsVue: TransformStaticReplaceOptions = {
  rules: [
    {
      env: 'server',
      call: {
        match: {
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: {
            0: {
              call: 'import:vue:unref',
              args: {
                0: 'import:vike-vue/ClientOnly:ClientOnly',
              },
            },
          },
        },
        remove: { arg: 2, prop: 'default' },
      },
    },
    {
      env: 'server',
      call: {
        match: {
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: {
            0: {
              member: true,
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

describe('transformStaticReplace', () => {
  it('Vue SFC dev', async () => {
    await testTransform(optionsVue, './snapshot-vue-sfc-dev-before', './snapshot-vue-sfc-dev-after')
  })
  it('Vue SFC prod', async () => {
    await testTransform(optionsVue, './snapshot-vue-sfc-prod-before', './snapshot-vue-sfc-prod-after')
  })
  it('React dev', async () => {
    await testTransform(optionsReact, './snapshot-react-prod-before', './snapshot-react-prod-after')
  })
  it('React prod', async () => {
    await testTransform(optionsReact, './snapshot-react-dev-before', './snapshot-react-dev-after')
  })
})

async function testTransform(options: TransformStaticReplaceOptions, before: string, after: string) {
  const code = readFileSync(join(__dirname, before), 'utf-8')
  const result = await transformStaticReplace({
    code,
    id: 'fake-id:pluginStaticReplace.spec.ts',
    options,
    env: 'server',
  })
  await expect(result!.code).toMatchFileSnapshot(after)
}
