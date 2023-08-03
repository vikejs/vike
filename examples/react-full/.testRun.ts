export { testRun }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, expectLog, sleep } from '@brillout/test-e2e'
import { ensureWasClientSideRouted } from '../../test/utils'

function testRun(viewFramework: 'vue' | 'react', cmd: 'npm run dev' | 'npm run preview', isV1Design?: true) {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome to <code>vite-plugin-ssr</code></h1>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Welcome to vite-plugin-ssr')

    // Interactive button
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })

    // Client-side routing
    await page.click('a[href="/star-wars"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Star Wars Movies')
    })
    expect(await page.textContent('body')).toContain('The Phantom Menace')
    await ensureWasClientSideRouted('/pages/index')
  })

  test('supports route functions', async () => {
    await page.goto(getServerUrl() + '/hello/alice')
    expect(await page.textContent('h1')).toContain('Hello')
    expect(await page.textContent('body')).toContain('Hi alice')

    await page.goto(getServerUrl() + '/hello/evan')
    expect(await page.textContent('h1')).toContain('Hello')
    expect(await page.textContent('body')).toContain('Hi evan')

    await page.goto(getServerUrl() + '/hello')
    expect(await page.textContent('body')).toContain('Hi anonymous')
  })

  test('data fetching page, HTML', async () => {
    const html = await fetchHtml('/star-wars')
    expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
    expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
  })

  test('data fetching page, DOM', async () => {
    await page.goto(getServerUrl() + '/star-wars')
    const text = await page.textContent('body')
    expect(text).toContain('Revenge of the Sith')
    expect(text).toContain('The Phantom Menace')

    if (viewFramework === 'vue') {
      // Attempt to make `examples/vue-full/.dev.test.ts` less flaky: it some times throws a "Hydration Mismatch" error (I don't know why).
      await sleep(1000)
    }
    await page.click('a[href="/star-wars/4"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('The Phantom Menace')
    })
    const pageContent =
      viewFramework === 'vue'
        ? 'The Phantom Menace Release Date: 1999-05-19  Director: George Lucas  Producer: Rick McCallum'
        : 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await page.textContent('body')).toContain(pageContent)
  })

  test('markdown page HTML', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<title>Some Markdown Page</title>')
    expect(html).toContain('This page is written in <em>Markdown</em>')
    if (viewFramework === 'react') {
      expect(html).toContain('<button>Counter <!-- -->0</button>')
    } else {
      expect(html).toContain('<button>Counter 0</button>')
    }
  })

  test('markdown page DOM', async () => {
    await page.goto(getServerUrl() + '/markdown')
    expect(await page.textContent('body')).toContain('This page is written in Markdown')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('test 404 page', async () => {
    const html = await fetchHtml('/doesNotExist')
    if (isV1Design) {
      expect(html).toContain('Page not found.')
    } else {
      expect(html).toContain('<h1>404 Page Not Found</h1>')
      expect(html).toContain('This page could not be found.')
    }
  })

  if (viewFramework === 'react') {
    test('async pageContext', async () => {
      const html = await fetchHtml('/')
      expect(html).toContain('"someAsyncProps":42')
    })
  }

  // In production, we pre-render all pages and thus `throw render()` will never be called.
  if (isDev) {
    test('throw render()', async () => {
      await page.goto(getServerUrl() + '/hello/bob')
      if (!isV1Design) {
        expect(await page.textContent('h1')).toBe('404 Page Not Found')
      }
      expectLog(
        'Failed to load resource: the server responded with a status of 404 (Not Found)',
        (log) => log.logSource === 'Browser Error' && log.logText.includes('http://localhost:3000/hello/bob')
      )
      if (!isV1Design) {
        expectLog(
          '[Warning] `throw RenderErrorPage()` is deprecated and will be removed in the next major release. Use `throw render()` or `throw redirect()` instead, see https://vite-plugin-ssr.com/render',
          (log) => log.logSource === 'stderr'
        )
      }
      const txt = 'Unknown name: bob.'
      expect(await page.textContent('body')).toContain(txt)
      const html = await fetchHtml('/hello/bob')
      expect(html).toContain(txt)
    })
    if (viewFramework === 'react') {
      test('guard()', async () => {
        await page.goto(getServerUrl() + '/hello/forbidden')
        if (!isV1Design) {
          expect(await page.textContent('h1')).toBe('Forbidden')
          expectLog(
            'Failed to load resource: the server responded with a status of 404 (Not Found)',
            (log) => log.logSource === 'Browser Error' && log.logText.includes('http://localhost:3000/hello/forbidden')
          )
        } else {
          expectLog('HTTP response /hello/forbidden 401', (log) => log.logSource === 'stderr')
          expectLog(
            'Failed to load resource: the server responded with a status of 401 (Unauthorized)',
            (log) => log.logSource === 'Browser Error' && log.logText.includes('http://localhost:3000/hello/forbidden')
          )
        }
        const txt = 'This page is forbidden.'
        expect(await page.textContent('body')).toContain(txt)
        const html = await fetchHtml('/hello/forbidden')
        expect(html).toContain(txt)
        if (isV1Design) {
          expectLog('HTTP response /hello/forbidden 401', (log) => log.logSource === 'stderr')
        }
      })
    }
  }
}
