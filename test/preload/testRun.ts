export { testRun }

import { expect, describe, it, assert } from 'vitest'
import path from 'node:path'
import { renderPage } from 'vike/server'
import { stabilizeHashes } from './utils/stabilizeHashes'
import type { EarlyHint } from 'vike/types'

function testRun(isDev: boolean) {
  describe('preload tags', () => {
    it(
      'Preload Default',
      async () => {
        const { body, earlyHints } = await render('/', isDev)
        expect(earlyHints).toMatchSnapshot()
        expect(body).toMatchSnapshot()
      },
      30 * 1000,
    )
    it('Preload Disabled', async () => {
      const { body, earlyHints } = await render('/preload-disabled', isDev)
      expect(earlyHints).toMatchSnapshot()
      expect(body).toMatchSnapshot()
    })
    it('Preload Images', async () => {
      const { body, earlyHints } = await render('/preload-images', isDev)
      expect(earlyHints).toMatchSnapshot()
      expect(body).toMatchSnapshot()
    })
    it('Preload Eager', async () => {
      const { body, earlyHints } = await render('/preload-eager', isDev)
      expect(earlyHints).toMatchSnapshot()
      expect(body).toMatchSnapshot()
    })
  })
}

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-images' | '/preload-eager', isDev: boolean) {
  const {
    httpResponse: { body, earlyHints },
  } = await renderPage({
    urlOriginal,
    //* Comment to try automatic generation
    cspNonce: '12345689',
    //*/
  })
  const { bodyStable, earlyHintsStable } = stabilize(body, earlyHints, isDev)
  return { body: bodyStable, earlyHints: earlyHintsStable }
}

function stabilize(body: string, earlyHints: EarlyHint[], isDev: boolean) {
  const stabilzeReferences = !isDev ? stabilizeHashes : stabilizePaths
  const isChunkAsset = (s: string) => {
    if (s.includes('chunks')) {
      assert(s.includes('/assets/chunks/chunk-'))
      return true
    }
    return false
  }
  const bodyStable = stabilzeReferences(body)
    .split('\n')
    .filter((line) => !isChunkAsset(line))
    .join('\n')
  const earlyHintsStable = earlyHints
    .map((hint) => {
      if (isChunkAsset(hint.src)) return null
      const hintStable = Object.fromEntries(
        Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
          val = typeof val !== 'string' ? val : stabilzeReferences(val)
          return [key, val]
        }),
      )
      return hintStable
    })
    .filter(Boolean)
  return { bodyStable, earlyHintsStable }
}

const workspaceRoot = getWorkspaceRoot()
function stabilizePaths(str: string): string {
  str = str.replaceAll(workspaceRoot, '/$ROOT')
  return str
}
function getWorkspaceRoot() {
  let workspaceRoot = path.join(__dirname, '..', '..').split('\\').join('/')
  if (!workspaceRoot.startsWith('/')) workspaceRoot = '/' + workspaceRoot
  return workspaceRoot
}
