import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vike/node/runtime'
import { build } from 'vite'
import { stabilizeHashs } from './utils/stabilizeHashs'

beforeAll(async () => {
  await buildApp()
}, 40 * 1000)

describe('preload tags', () => {
  it('Preload Default', async () => {
    const { body, earlyHints } = await render('/')
    expect(earlyHints).toMatchSnapshot()
    expect(body).toMatchSnapshot()
  })
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

async function buildApp() {
  const inlineConfig = {
    logLevel: 'warn' as const,
    root: __dirname,
    configFile: __dirname + '/vite.config.js'
  }
  await build(inlineConfig)
  await build({
    build: { ssr: true },
    ...inlineConfig
  })
}

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-images' | '/preload-eager') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizeHashs(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilizeHashs(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}
