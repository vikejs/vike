export { testRun }

import { expect, describe, it } from 'vitest'
import path from 'node:path'
import { renderPage } from 'vike/server'
import { stabilizeHashes } from './utils/stabilizeHashes'

function testRun(isDev: boolean) {
  describe('preload tags', () => {
    it(
      'Preload Default',
      async () => {
        const { body, earlyHints } = await render('/', isDev)
        expect(earlyHints).toMatchSnapshot()
        expect(body).toMatchSnapshot()
      },
      15 * 1000,
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
  const stabilzeReferences = !isDev ? stabilizeHashes : stabilizePaths
  const { httpResponse } = await renderPage({ urlOriginal, cspNonce: '12345689' })
  const body = stabilzeReferences(httpResponse.body)
  const earlyHints = httpResponse.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilzeReferences(val)
        return [key, val]
      }),
    ),
  )
  return { body, earlyHints }
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
