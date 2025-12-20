import { transformStaticReplace, StaticReplace } from '../pluginStaticReplace.js'
import { buildFilterRolldown } from './pluginStaticReplace.js'
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const staticReplaceReact: StaticReplace[] = [
  {
    env: 'server',
    type: 'call',
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
  {
    env: 'server',
    type: 'call',
    match: {
      function: 'import:react:createElement',
      args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
    },
    remove: { argsFrom: 2 },
  },
  {
    env: 'server',
    type: 'call',
    match: {
      function: 'import:vike-react/useHydrated:useHydrated',
    },
    replace: { with: false },
  },
]

const staticReplaceVue: StaticReplace[] = [
  {
    env: 'server',
    type: 'call',
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
  {
    env: 'server',
    type: 'call',
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
]

const staticReplaceSolid: StaticReplace[] = [
  {
    env: 'server',
    type: 'call',
    match: {
      function: 'import:solid-js/web:createComponent',
      args: { 0: 'ClientOnly' },
    },
    remove: { arg: 1, prop: 'children' },
  },
]

describe('transformStaticReplace', () => {
  const snapshots = getSnapshots()
  for (const snapshot of snapshots) {
    it(snapshot.testName, async () => {
      await testTransform(snapshot.options, `./${snapshot.beforeFile}`, `./${snapshot.afterFile}`)
    })
  }
})

async function testTransform(options: StaticReplace[], before: string, after: string) {
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

    let options: StaticReplace[]
    if (testName.includes('vue')) {
      options = staticReplaceVue
    } else if (testName.includes('solid')) {
      options = staticReplaceSolid
    } else if (testName.includes('react')) {
      options = staticReplaceReact
    } else {
      throw new Error(`Unknown framework in test name: ${testName}`)
    }

    return { testName, beforeFile, afterFile, options }
  })
}

describe('buildFilterRolldown', () => {
  it('returns filter for optionsReact', () => {
    const filter = buildFilterRolldown(staticReplaceReact)
    expect(filter).not.toBeNull()
    expect(filter!.code.include).toBeInstanceOf(RegExp)

    // Rule 1: Should match code containing (jsx OR jsxs OR jsxDEV) AND ClientOnly
    expect(
      filter!.code.include.test(
        'import { jsx } from "react/jsx-runtime"; import { ClientOnly } from "vike-react/ClientOnly"',
      ),
    ).toBe(true)
    expect(
      filter!.code.include.test(
        'import { jsxDEV } from "react/jsx-dev-runtime"; import { ClientOnly } from "vike-react/ClientOnly"',
      ),
    ).toBe(true)

    // Rule 2: Should match code containing createElement AND ClientOnly
    expect(
      filter!.code.include.test(
        'import { createElement } from "react"; import { ClientOnly } from "vike-react/ClientOnly"',
      ),
    ).toBe(true)

    // Rule 3: Should match code containing useHydrated alone
    expect(filter!.code.include.test('import { useHydrated } from "vike-react/useHydrated"')).toBe(true)

    // Should NOT match ClientOnly alone (doesn't satisfy any complete rule)
    expect(filter!.code.include.test('import { ClientOnly } from "vike-react/ClientOnly"')).toBe(false)

    // Should not match code without any of the imports
    expect(filter!.code.include.test('import React from "react"')).toBe(false)
  })

  it('returns filter for optionsVue', () => {
    const filter = buildFilterRolldown(staticReplaceVue)
    expect(filter).not.toBeNull()
    expect(filter!.code.include).toBeInstanceOf(RegExp)

    // Rule 1: Should match code containing ssrRenderComponent AND unref AND ClientOnly
    expect(
      filter!.code.include.test(
        'import { ssrRenderComponent } from "vue/server-renderer"; import { unref } from "vue"; import { ClientOnly } from "vike-vue/ClientOnly"',
      ),
    ).toBe(true)

    // Rule 2: Should match code containing ssrRenderComponent alone (member expression has no import strings)
    expect(filter!.code.include.test('import { ssrRenderComponent } from "vue/server-renderer"')).toBe(true)

    // Should NOT match unref alone (doesn't satisfy any complete rule)
    expect(filter!.code.include.test('import { unref } from "vue"')).toBe(false)

    // Should NOT match ClientOnly alone (doesn't satisfy any complete rule)
    expect(filter!.code.include.test('import { ClientOnly } from "vike-vue/ClientOnly"')).toBe(false)

    // Should not match code without any of the imports
    expect(filter!.code.include.test('import { ref } from "vue"')).toBe(false)
  })

  it('returns filter for optionsSolid', () => {
    const filter = buildFilterRolldown(staticReplaceSolid)
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
        type: 'call',
        match: {
          function: 'plainFunction',
          args: { 0: 'plainString' },
        },
        remove: { arg: 0 },
      },
    ])
    expect(filter).toBeNull()
  })
})
