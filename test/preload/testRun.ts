export { testRun }

import { expect, describe, it } from 'vitest'
import path from 'path'
import { renderPage } from 'vike/server'
import { stabilizeHashs } from './utils/stabilizeHashs'

function testRun(isDev: boolean) {
  describe('preload tags', () => {
    it(
      'Preload Default',
      async () => {
        const { body, earlyHints } = await render('/', isDev)
        expect(earlyHints).toMatchSnapshot()
        expect(body).toMatchSnapshot()
      },
      15 * 1000
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
  const stabilzeReferences = !isDev ? stabilizeHashs : stabilizePaths
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilzeReferences(httpResponse.body)
  const earlyHints = httpResponse.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilzeReferences(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}

const workspaceRoot = path.join(__dirname, '..', '..')
function stabilizePaths(str: string): string {
  console.log('str', str)
  console.log('workspaceRoot', workspaceRoot)
  console.log('__dirname', __dirname)
  str = str.replaceAll(workspaceRoot, '/$ROOT')
  return str
}
