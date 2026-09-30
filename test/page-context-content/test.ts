export { testRun as test }

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { run, test, expect, fetch, fetchHtml, getServerUrl, expectLog, partRegex } from '@brillout/test-e2e'
import { bytes as imageBytes } from './pages/image/bytes'

const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Café</title>
  <!-- prerenderCount: 1 -->
</feed>
`
const streamText = 'hello é\n'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)
  const isPrerendered = cmd === 'pnpm run preview'

  test('HTML page', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
  })

  test('string content', async () => {
    const resp = await fetchUrl('/feed.atom')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'application/atom+xml;charset=utf-8')
    if (!isPrerendered) expect(resp.headers.get('content-type')).toBe('application/atom+xml;charset=utf-8')
    const body = await resp.text()
    if (isPrerendered) {
      expect(body).toBe(feed)
    } else {
      expect(body).toBe(feed.replace('prerenderCount: 1', 'prerenderCount: 0'))
    }
  })

  test('Uint8Array content', async () => {
    const resp = await fetchUrl('/image.png')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'image/png')
    expect(toHex(new Uint8Array(await resp.arrayBuffer()))).toBe(toHex(imageBytes))
  })

  test('ReadableStream content', async () => {
    const resp = await fetchUrl('/stream.txt')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/plain;charset=utf-8')
    if (!isPrerendered) expect(resp.headers.get('content-type')).toBe('text/plain;charset=utf-8')
    const reader = resp.body!.getReader()
    const chunks: Uint8Array[] = []
    if (!isPrerendered) {
      // Streamed: the first chunk arrives while the server holds back the second one
      const first = await reader.read()
      expect(toHex(first.value!)).toBe(toHex(new TextEncoder().encode('hello ')) + ' c3')
      chunks.push(first.value!)
      expect(await (await fetchUrl('/stream-release.txt')).text()).toBe('released')
    }
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    expect(new TextDecoder().decode(concat(chunks))).toBe(streamText)
  })

  test('public/ file next to content pages', async () => {
    const resp = await fetchUrl('/robots.txt')
    expect(resp.status).toBe(200)
    // Compared to the file itself, since Git may check it out with CRLF line endings (Windows)
    const robotsTxt = fs.readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), 'public/robots.txt'),
      'utf8',
    )
    expect(await resp.text()).toBe(robotsTxt)
  })

  test('headersResponse overrides the Content-Type', async () => {
    const resp = await fetchUrl('/override.json')
    expect(resp.status).toBe(200)
    expect(resp.headers.get('content-type')).toBe('application/feed+json')
    expect(resp.headers.get('cache-control')).toBe('public, max-age=60')
    expect(await resp.text()).toBe('{"version":"https://jsonfeed.org/version/1.1"}')
  })

  test('pageContext.content is ignored if the render hook returns HTML', async () => {
    const resp = await fetchUrl('/custom-content')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/html;charset=utf-8')
    expect(await resp.text()).toContain('<h1>Set by onBeforeRender() and onRenderHtml()</h1>')
  })

  test('pageContext.content set before the render hook, then set again to the same value', async () => {
    const resp = await fetchUrl('/reassign.txt')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/plain;charset=utf-8')
    expect(await resp.text()).toBe('Same value')
  })

  test('stream error before the first chunk', async () => {
    const resp = await fetchUrl('/stream-error.txt')
    expect(resp.status).toBe(500)
    // The error page is rendered
    expect(resp.headers.get('content-type')).toBe('text/html;charset=utf-8')
    expect(await resp.text()).toContain('<h1>Something went wrong</h1>')
    expectLog('Some stream error')
    expectLog(partRegex`HTTP response ${/.*/} /stream-error.txt 500`, { filter: (log) => log.logSource === 'stderr' })
  })

  test('stream error after the first chunk', async () => {
    const resp = await fetchUrl('/stream-error-late.txt')
    expect(resp.status).toBe(200)
    // The response is aborted instead of ending normally
    let err: unknown
    try {
      await resp.arrayBuffer()
    } catch (err_) {
      err = err_
    }
    expect(err).toBeTruthy()
    expectLog('Some late stream error')
    // The server is still up
    expect(await fetchHtml('/')).toContain('<h1>Welcome</h1>')
  })

  if (isPrerendered) {
    test('pre-rendered files', () => {
      const distClient = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist/client')
      const read = (filePath: string) => new Uint8Array(fs.readFileSync(path.join(distClient, filePath)))
      // The file is written at the URL, and the page is rendered once
      expect(new TextDecoder().decode(read('feed.atom'))).toBe(feed)
      expect(toHex(read('image.png'))).toBe(toHex(imageBytes))
      expect(new TextDecoder().decode(read('stream.txt'))).toBe(streamText)
      expect(new TextDecoder().decode(read('reassign.txt'))).toBe('Same value')
      // Not overwritten by pre-rendering
      expect(new TextDecoder().decode(read('emitted.txt'))).toBe('Emitted by a plugin')
      expect(fs.statSync(path.join(distClient, 'feed.atom')).isFile()).toBe(true)
      expect(fs.existsSync(path.join(distClient, 'index.html'))).toBe(true)
      expect(fs.existsSync(path.join(distClient, 'override.json'))).toBe(false)
    })
  }
}

async function fetchUrl(pathname: string) {
  return await fetch(getServerUrl() + pathname)
}

function expectContentType(resp: Response, contentType: string) {
  expect(resp.headers.get('content-type')!.split(';')[0]).toBe(contentType.split(';')[0])
}

function concat(chunks: Uint8Array[]) {
  const bytes = new Uint8Array(chunks.reduce((len, c) => len + c.length, 0))
  let offset = 0
  for (const c of chunks) {
    bytes.set(c, offset)
    offset += c.length
  }
  return bytes
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ')
}
