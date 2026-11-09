export { testContent }

import fs from 'node:fs'
import path from 'node:path'
import { autoRetry, expect, expectLog, fetch, getServerUrl, partRegex, test } from '@brillout/test-e2e'
import { bytes as imageBytes } from './image/bytes'

const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Café</title>
</feed>
`
const streamText = 'hello é\n'

// TEST: pageContext.content https://vike.dev/pageContext#content
function testContent({ isDev, rootDir }: { isDev: boolean; rootDir: string }) {
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
    expect(new TextDecoder().decode(new Uint8Array(await resp.arrayBuffer()))).toBe(streamText)
  })

  test('pageContext.content: stream error before the first chunk', async () => {
    const resp = await fetchUrl('/content/stream-error.txt')
    expect(resp.status).toBe(500)
    // The error fallback is rendered
    expect(resp.headers.get('content-type')).toBe('text/html;charset=utf-8')
    expect(await resp.text()).toContain('<p>An error occurred.</p>')
    expectLog('Some stream error')
    if (isDev) expectLog('No error page found')
    // The server may log the response after the client received it
    await autoRetry(
      () => {
        expectLog(partRegex`HTTP response ${/.*/} /content/stream-error.txt 500`, {
          filter: (log) => log.logSource === 'stderr',
        })
      },
      { timeout: 5000 },
    )
  })

  if (!isDev) {
    test('pageContext.content: pre-rendered files', () => {
      const read = (filePath: string) =>
        new Uint8Array(fs.readFileSync(path.join(rootDir, 'dist/nested/client/content', filePath)))
      // The file is written at the URL
      expect(new TextDecoder().decode(read('feed.atom'))).toBe(feed)
      expect(toHex(read('image.png'))).toBe(toHex(imageBytes))
      expect(new TextDecoder().decode(read('stream.txt'))).toBe(streamText)
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

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ')
}
