import { applyStaticReplace, StaticReplace } from './applyStaticReplace.js'
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
      args: { 0: 'import:vike-solid/ClientOnly:ClientOnly' },
    },
    remove: { arg: 1, prop: 'children' },
  },
]

describe('applyStaticReplace', () => {
  const snapshots = getSnapshots()
  for (const snapshot of snapshots) {
    it(snapshot.testName, async () => {
      await testTransform(snapshot.staticReplaceList, `./${snapshot.beforeFile}`, `./${snapshot.afterFile}`)
    })
  }
})

async function testTransform(staticReplaceList: StaticReplace[], before: string, after: string) {
  const code = readFileSync(join(__dirname, before), 'utf-8')
  const result = await applyStaticReplace(code, staticReplaceList, 'fake-id:staticReplace.spec.ts', 'server')
  await expect(result!.code).toMatchFileSnapshot(after)
}

function getSnapshots() {
  const files = readdirSync(join(__dirname, 'snapshots'))
  const beforeFiles = files.filter((f) => f.endsWith('-before'))

  return beforeFiles.map((beforeFile) => {
    const testName = beforeFile.replace('', '').replace('-before', '')
    const afterFile = beforeFile.replace('-before', '-after')

    let staticReplaceList: StaticReplace[]
    if (testName.includes('vue')) {
      staticReplaceList = staticReplaceVue
    } else if (testName.includes('solid')) {
      staticReplaceList = staticReplaceSolid
    } else if (testName.includes('react')) {
      staticReplaceList = staticReplaceReact
    } else {
      throw new Error(`Unknown framework in test name: ${testName}`)
    }

    return {
      testName,
      beforeFile: `snapshots/${beforeFile}` as const,
      afterFile: `snapshots/${afterFile}` as const,
      staticReplaceList,
    } as const
  })
}
