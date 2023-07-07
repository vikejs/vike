import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node/runtime'
import { createServer } from 'vite'
import path from 'path'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

describe('preload tags', () => {
  it(
    'Preload Default',
    async () => {
      const { body, earlyHints } = await render('/')
      expect(earlyHints).toMatchSnapshot()
      expect(body).toMatchSnapshot()
    },
    10 * 1000
  )
  it('Preload Disabled', async () => {
    const { body, earlyHints } = await render('/preload-disabled')
    expect(earlyHints).toMatchSnapshot()
    expect(body).toMatchSnapshot()
  })
  it('Preload Images', async () => {
    const { body, earlyHints } = await render('/preload-images')
    expect(earlyHints).toMatchSnapshot()
    expect(body).toMatchSnapshot()
  })
  it('Preload Eager', async () => {
    const { body, earlyHints } = await render('/preload-eager')
    expect(earlyHints).toMatchSnapshot()
    expect(body).toMatchSnapshot()
  })
})

async function devApp() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-images' | '/preload-eager') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizePaths(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilizePaths(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}

const workspaceRoot = path.join(__dirname, '..', '..')
function stabilizePaths(str: string): string {
  str = str.replaceAll(workspaceRoot, '/$ROOT')
  return str
}
