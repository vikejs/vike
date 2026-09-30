export { testContent }

import fs from 'node:fs'
import path from 'node:path'
import { expect, expectLog, fetch, getServerUrl, partRegex, test } from '@brillout/test-e2e'
import { bytes as imageBytes } from './image/bytes'

const getFeed = (prerenderCount: number) => `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Café</title>
  <!-- prerenderCount: ${prerenderCount} -->
</feed>
`
const streamText = 'hello é\n'

// TEST: pageContext.content https://vike.dev/pageContext#content
function testContent({ isDev, isBuildTwice, rootDir }: { isDev: boolean; isBuildTwice: boolean; rootDir: string }) {
  // The page is rendered once per build (the server module is reused by the second build)
  const feed = getFeed(isDev ? 0 : isBuildTwice ? 2 : 1)
  test('pageContext.content: string', async () => {
    const resp = await fetchUrl('/content/feed.atom')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'application/atom+xml;charset=utf-8', isDev)
    expect(await resp.text()).toBe(feed)
  })

  test('pageContext.content: Uint8Array', async () => {
    const resp = await fetchUrl('/content/image.png')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'image/png', isDev)
    expect(toHex(new Uint8Array(await resp.arrayBuffer()))).toBe(toHex(imageBytes))
  })

  test('pageContext.content: ReadableStream', async () => {
    const resp = await fetchUrl('/content/stream.txt')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/plain;charset=utf-8', isDev)
    const reader = resp.body!.getReader()
    const chunks: Uint8Array[] = []
    if (isDev) {
      // Streamed: the first chunk arrives while the server holds back the second one
      const first = await reader.read()
      expect(toHex(first.value!)).toBe(toHex(new TextEncoder().encode('hello ')) + ' c3')
      chunks.push(first.value!)
      expect(await (await fetchUrl('/content/stream-release.txt')).text()).toBe('released')
    }
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    expect(new TextDecoder().decode(concat(chunks))).toBe(streamText)
  })

  test('pageContext.content: headersResponse overrides the Content-Type', async () => {
    const resp = await fetchUrl('/content/override.json')
    expect(resp.status).toBe(200)
    expect(resp.headers.get('content-type')).toBe('application/feed+json')
    expect(resp.headers.get('cache-control')).toBe('public, max-age=60')
    expect(await resp.text()).toBe('{"version":"https://jsonfeed.org/version/1.1"}')
  })

  test('pageContext.content: ignored if the render hook returns HTML', async () => {
    const resp = await fetchUrl('/content/custom-content')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/html;charset=utf-8', true)
    expect(await resp.text()).toContain('<h1>Set by onBeforeRender() and onRenderHtml()</h1>')
  })

  test('pageContext.content: set before the render hook, then set again to the same value', async () => {
    const resp = await fetchUrl('/content/reassign.txt')
    expect(resp.status).toBe(200)
    expectContentType(resp, 'text/plain;charset=utf-8', isDev)
    expect(await resp.text()).toBe('Same value')
  })

  test('pageContext.content: stream error before the first chunk', async () => {
    const resp = await fetchUrl('/content/stream-error.txt')
    expect(resp.status).toBe(500)
    // The error fallback is rendered
    expect(resp.headers.get('content-type')).toBe('text/html;charset=utf-8')
    expect(await resp.text()).toContain('<p>An error occurred.</p>')
    expectLog('Some stream error')
    if (isDev) expectLog('No error page found')
    expectLog(partRegex`HTTP response ${/.*/} /content/stream-error.txt 500`, {
      filter: (log) => log.logSource === 'stderr',
    })
  })

  test('pageContext.content: stream error after the first chunk', async () => {
    const resp = await fetchUrl('/content/stream-error-late.txt')
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
    expect(await (await fetchUrl('/content/reassign.txt')).text()).toBe('Same value')
  })

  if (!isDev) {
    test('pageContext.content: pre-rendered files', () => {
      const read = (filePath: string) =>
        new Uint8Array(fs.readFileSync(path.join(rootDir, 'dist/nested/client/content', filePath)))
      // The file is written at the URL, and the page is rendered once
      expect(new TextDecoder().decode(read('feed.atom'))).toBe(feed)
      expect(toHex(read('image.png'))).toBe(toHex(imageBytes))
      expect(new TextDecoder().decode(read('stream.txt'))).toBe(streamText)
      expect(new TextDecoder().decode(read('reassign.txt'))).toBe('Same value')
      expect(fs.existsSync(path.join(rootDir, 'dist/nested/client/content/override.json'))).toBe(false)
    })
  }
}

async function fetchUrl(pathname: string) {
  return await fetch(getServerUrl() + pathname)
}

// The static host serving pre-rendered files sets its own charset
function expectContentType(resp: Response, contentType: string, isExact: boolean) {
  const actual = resp.headers.get('content-type')!
  expect(isExact ? actual : actual.split(';')[0]).toBe(isExact ? contentType : contentType.split(';')[0])
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
