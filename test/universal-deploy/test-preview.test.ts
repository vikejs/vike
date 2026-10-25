import { testRun } from './.testRun'
import { test, expect, fetch, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

testRun('pnpm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })

// https://vike.dev/precompress
test('precompress', async () => {
  const assetsDir = path.join(distDir, 'client', 'assets')
  const files = crawl(assetsDir)
  const js = files.filter((f) => f.endsWith('.js'))
  const br = files.filter((f) => f.endsWith('.js.br'))
  expect(js.length > 0).toBe(true)
  expect(br.length > 0).toBe(true)
  br.forEach((f) => expect(js).toContain(f.slice(0, -'.br'.length)))

  const brFile = br[0]!
  const assetUrl = path.relative(path.join(distDir, 'client'), brFile.slice(0, -'.br'.length)).split(path.sep).join('/')
  const response = await fetch(`${getServerUrl()}/${assetUrl}`, { headers: { 'accept-encoding': 'br' } })
  expect(response.status).toBe(200)
  expect(response.headers.get('content-encoding')).toBe('br')
  // Served from disk: compressing per request doesn't set a content-length
  expect(response.headers.get('content-length')).toBe(String(fs.statSync(brFile).size))

  // The .br/.gz files aren't in the assets manifest (used for preload tags)
  const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'assets.json'), 'utf-8'))
  const entries = Object.values(manifest) as { file?: string; css?: string[]; assets?: string[] }[]
  const referenced = entries.flatMap((e) => [e.file, ...(e.css ?? []), ...(e.assets ?? [])]).filter(Boolean)
  expect(referenced.some((f) => f!.endsWith('.js'))).toBe(true)
  expect(referenced.filter((f) => f!.endsWith('.br') || f!.endsWith('.gz')).join(' ')).toBe('')
})

// https://vike.dev/csp#sri
test('sri', async () => {
  const html = await fetchHtml('/')
  const tags = html.match(/<(script|link)\b[^>]*>/g)!.filter((tag) => /\.(js|css)"/.test(tag))
  expect(tags.length > 0).toBe(true)
  for (const tag of tags) {
    const src = tag.match(/(?:src|href)="([^"]+)"/)![1]!
    const response = await fetch(`${getServerUrl()}${src}`)
    const hash = crypto
      .createHash('sha384')
      .update(Buffer.from(await response.arrayBuffer()))
      .digest('base64')
    expect(tag).toContain(` integrity="sha384-${hash}"`)
  }
})

function crawl(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    return entry.isDirectory() ? crawl(filePath) : [filePath]
  })
}
