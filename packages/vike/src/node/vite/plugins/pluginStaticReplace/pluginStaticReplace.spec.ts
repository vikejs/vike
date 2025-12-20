import { transformStaticReplace, TransformStaticReplaceOptions } from '../pluginStaticReplace.js'
import { buildFilterRolldown } from './pluginStaticReplace.js'
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// TODO: improve API?
const optionsReact: TransformStaticReplaceOptions = {
  // TODO: remove rules
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
        // TODO: set with to string
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

const optionsSolid: TransformStaticReplaceOptions = {
  rules: [
    {
      env: 'server',
      call: {
        match: {
          function: 'import:solid-js/web:createComponent',
          args: { 0: 'ClientOnly' },
        },
        remove: { arg: 1, prop: 'children' },
      },
    },
  ],
}

describe('transformStaticReplace', () => {
  const snapshots = getSnapshots()
  for (const snapshot of snapshots) {
    it(snapshot.testName, async () => {
      await testTransform(snapshot.options, `./${snapshot.beforeFile}`, `./${snapshot.afterFile}`)
    })
  }
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

function getSnapshots() {
  const files = readdirSync(__dirname)
  const beforeFiles = files.filter((f) => f.startsWith('snapshot-') && f.endsWith('-before'))

  return beforeFiles.map((beforeFile) => {
    const testName = beforeFile.replace('snapshot-', '').replace('-before', '')
    const afterFile = beforeFile.replace('-before', '-after')

    let options: TransformStaticReplaceOptions
    if (testName.includes('vue')) {
      options = optionsVue
    } else if (testName.includes('solid')) {
      options = optionsSolid
    } else if (testName.includes('react')) {
      options = optionsReact
    } else {
      throw new Error(`Unknown framework in test name: ${testName}`)
    }

    return { testName, beforeFile, afterFile, options }
  })
}

describe('buildFilterRolldown', () => {
  it('returns filter for optionsReact', () => {
    const filter = buildFilterRolldown(optionsReact.rules)
    expect(filter).not.toBeNull()
    expect(filter!.code.include).toBeInstanceOf(RegExp)

    // Should match code containing react/jsx-runtime and ClientOnly
    expect(
      filter!.code.include.test(
        'import { jsx } from "react/jsx-runtime"; import { ClientOnly } from "vike-react/ClientOnly"',
      ),
    ).toBe(true)
    // Should match code containing vike-react/ClientOnly and ClientOnly
    expect(filter!.code.include.test('import { ClientOnly } from "vike-react/ClientOnly"')).toBe(true)
    // Should match code containing useHydrated
    expect(filter!.code.include.test('import { useHydrated } from "vike-react/useHydrated"')).toBe(true)
    // Should not match code without any of the imports
    expect(filter!.code.include.test('import React from "react"')).toBe(false)
  })

  it('returns filter for optionsVue', () => {
    const filter = buildFilterRolldown(optionsVue.rules)
    expect(filter).not.toBeNull()
    expect(filter!.code.include).toBeInstanceOf(RegExp)

    // Should match code containing vue/server-renderer and ssrRenderComponent
    expect(filter!.code.include.test('import { ssrRenderComponent } from "vue/server-renderer"')).toBe(true)
    // Should match code containing vue and unref
    expect(filter!.code.include.test('import { unref } from "vue"')).toBe(true)
    // Should match code containing vike-vue/ClientOnly and ClientOnly
    expect(filter!.code.include.test('import { ClientOnly } from "vike-vue/ClientOnly"')).toBe(true)
    // Should not match code without any of the imports
    expect(filter!.code.include.test('import { ref } from "vue"')).toBe(false)
  })

  it('returns filter for optionsSolid', () => {
    const filter = buildFilterRolldown(optionsSolid.rules)
    expect(filter).not.toBeNull()
    expect(filter!.code.include).toBeInstanceOf(RegExp)

    // Should match code containing solid-js/web and createComponent
    expect(filter!.code.include.test('import { createComponent } from "solid-js/web"')).toBe(true)
    // Should not match code without the import
    expect(filter!.code.include.test('import { createSignal } from "solid-js"')).toBe(false)
  })

  it('returns null for empty rules', () => {
    const filter = buildFilterRolldown([])
    expect(filter).toBeNull()
  })

  it('returns null for rules without import strings', () => {
    const filter = buildFilterRolldown([
      {
        call: {
          match: {
            function: 'plainFunction',
            args: { 0: 'plainString' },
          },
          remove: { arg: 0 },
        },
      },
    ])
    expect(filter).toBeNull()
  })
})
