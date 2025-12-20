import { buildFilterRolldown } from './buildFilterRolldown.js'
import { StaticReplace } from './applyStaticReplace.js'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

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

describe('buildFilterRolldown', () => {
  it('returns filter for optionsReact', () => {
    const filter = buildFilterRolldown(staticReplaceReact)
    expect(filter).not.toBeNull()
    expect(filter).toBeInstanceOf(RegExp)

    // Rule 1: Should match code containing (jsx OR jsxs OR jsxDEV) AND ClientOnly
    expect(
      filter!.test('import { jsx } from "react/jsx-runtime"; import { ClientOnly } from "vike-react/ClientOnly"'),
    ).toBe(true)
    expect(
      filter!.test(
        'import { jsxDEV } from "react/jsx-dev-runtime"; import { ClientOnly } from "vike-react/ClientOnly"',
      ),
    ).toBe(true)

    // Rule 2: Should match code containing createElement AND ClientOnly
    expect(
      filter!.test('import { createElement } from "react"; import { ClientOnly } from "vike-react/ClientOnly"'),
    ).toBe(true)

    // Rule 3: Should match code containing useHydrated alone
    expect(filter!.test('import { useHydrated } from "vike-react/useHydrated"')).toBe(true)

    // Should NOT match ClientOnly alone (doesn't satisfy any complete rule)
    expect(filter!.test('import { ClientOnly } from "vike-react/ClientOnly"')).toBe(false)

    // Should not match code without any of the imports
    expect(filter!.test('import React from "react"')).toBe(false)
  })

  it('returns filter for optionsVue', () => {
    const filter = buildFilterRolldown(staticReplaceVue)
    expect(filter).not.toBeNull()
    expect(filter).toBeInstanceOf(RegExp)

    // Rule 1: Should match code containing ssrRenderComponent AND unref AND ClientOnly
    expect(
      filter!.test(
        'import { ssrRenderComponent } from "vue/server-renderer"; import { unref } from "vue"; import { ClientOnly } from "vike-vue/ClientOnly"',
      ),
    ).toBe(true)

    // Rule 2: Should match code containing ssrRenderComponent alone (member expression has no import strings)
    expect(filter!.test('import { ssrRenderComponent } from "vue/server-renderer"')).toBe(true)

    // Should NOT match unref alone (doesn't satisfy any complete rule)
    expect(filter!.test('import { unref } from "vue"')).toBe(false)

    // Should NOT match ClientOnly alone (doesn't satisfy any complete rule)
    expect(filter!.test('import { ClientOnly } from "vike-vue/ClientOnly"')).toBe(false)

    // Should not match code without any of the imports
    expect(filter!.test('import { ref } from "vue"')).toBe(false)
  })

  it('returns filter for optionsSolid', () => {
    const filter = buildFilterRolldown(staticReplaceSolid)
    expect(filter).not.toBeNull()
    expect(filter).toBeInstanceOf(RegExp)

    // Should match code containing solid-js/web and createComponent
    expect(filter!.test('import { createComponent } from "solid-js/web"')).toBe(true)
    // Should not match code without the import
    expect(filter!.test('import { createSignal } from "solid-js"')).toBe(false)
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

  describe('snapshot tests', () => {
    const readSnapshot = (filename: string): string => {
      return readFileSync(join(__dirname, 'snapshots', filename), 'utf-8')
    }

    it('React filter matches React snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceReact)
      expect(filter).not.toBeNull()

      const reactDevBefore = readSnapshot('react-dev-before')
      const reactProdBefore = readSnapshot('react-prod-before')
      const classicReactDevBefore = readSnapshot('classic-react-dev-before')
      const classicReactProdBefore = readSnapshot('classic-react-prod-before')

      expect(filter!.test(reactDevBefore)).toBe(true)
      expect(filter!.test(reactProdBefore)).toBe(true)
      expect(filter!.test(classicReactDevBefore)).toBe(true)
      expect(filter!.test(classicReactProdBefore)).toBe(true)
    })

    it('Vue filter matches Vue snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceVue)
      expect(filter).not.toBeNull()

      const vueDevBefore = readSnapshot('vue-dev-before')
      const vueProdBefore = readSnapshot('vue-prod-before')

      expect(filter!.test(vueDevBefore)).toBe(true)
      expect(filter!.test(vueProdBefore)).toBe(true)
    })

    it('Solid filter matches Solid snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceSolid)
      expect(filter).not.toBeNull()

      const solidBefore = readSnapshot('solid-before')

      expect(filter!.test(solidBefore)).toBe(true)
    })

    it('React filter does not match Vue/Solid snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceReact)
      expect(filter).not.toBeNull()

      const vueDevBefore = readSnapshot('vue-dev-before')
      const solidBefore = readSnapshot('solid-before')

      expect(filter!.test(vueDevBefore)).toBe(false)
      expect(filter!.test(solidBefore)).toBe(false)
    })

    it('Vue filter does not match React/Solid snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceVue)
      expect(filter).not.toBeNull()

      const reactDevBefore = readSnapshot('react-dev-before')
      const solidBefore = readSnapshot('solid-before')

      expect(filter!.test(reactDevBefore)).toBe(false)
      expect(filter!.test(solidBefore)).toBe(false)
    })

    it('Solid filter does not match React/Vue snapshots', () => {
      const filter = buildFilterRolldown(staticReplaceSolid)
      expect(filter).not.toBeNull()

      const reactDevBefore = readSnapshot('react-dev-before')
      const vueDevBefore = readSnapshot('vue-dev-before')

      expect(filter!.test(reactDevBefore)).toBe(false)
      expect(filter!.test(vueDevBefore)).toBe(false)
    })
  })
})
