import { testRun } from './.testRun'
import { test, expect, fetch, getServerUrl } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

testRun('pnpm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })

// +config.ts sets `precompress: true`: the build writes .br files next to the static assets, and the
// server serves those files instead of compressing on every request.
test('precompress', async () => {
  const assetsDir = path.join(distDir, 'client', 'assets')
  const files = crawl(assetsDir)
  const js = files.filter((f) => f.endsWith('.js'))
  const br = files.filter((f) => f.endsWith('.js.br'))

  // A build that emitted no JS at all must not pass the assertions below.
  expect(js.length > 0).toBe(true)

  // The build emitted variants, and each one belongs to an asset that exists.
  expect(br.length > 0).toBe(true)
  br.forEach((f) => expect(js).toContain(f.slice(0, -'.br'.length)))

  const brFile = br[0]!
  const assetUrl = path.relative(path.join(distDir, 'client'), brFile.slice(0, -'.br'.length)).split(path.sep).join('/')
  const response = await fetch(`${getServerUrl()}/${assetUrl}`, { headers: { 'accept-encoding': 'br' } })
  expect(response.status).toBe(200)

  // Necessary but not sufficient: a realtime re-encode sets this same header.
  expect(response.headers.get('content-encoding')).toBe('br')

  // A realtime re-encode streams without a length; only serving the file off disk sets one, and it
  // equals that file's size. This is what distinguishes serving the variant from re-encoding it.
  // Holds on Windows because +server.ts leaves `prod.static` unset: the precompressed and served
  // directories are then the same string, and the lookup is enabled only on exact string equality.
  // Setting `prod.static` here — even to the same directory — would make this spelling-dependent.
  expect(response.headers.get('content-length')).toBe(String(fs.statSync(brFile).size))

  // Variants are alternate representations of an existing URL, not assets of their own: they must
  // never reach the manifest, which is what Vike generates preload tags from.
  const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'assets.json'), 'utf-8'))
  const entries = Object.values(manifest) as { file?: string; css?: string[]; assets?: string[] }[]
  const referenced = entries.flatMap((e) => [e.file, ...(e.css ?? []), ...(e.assets ?? [])]).filter(Boolean)
  expect(referenced.some((f) => f!.endsWith('.js'))).toBe(true)
  // Joined so that a failure names the offending entries.
  expect(referenced.filter((f) => f!.endsWith('.br') || f!.endsWith('.gz')).join(' ')).toBe('')
})

function crawl(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    return entry.isDirectory() ? crawl(filePath) : [filePath]
  })
}
