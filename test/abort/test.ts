export { testRun as test }

import {
  run,
  page,
  test,
  expect,
  getServerUrl,
  fetchHtml,
  autoRetry,
  expectLog,
  partRegex,
  sleep,
} from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl, testCounter, expectPageContextJsonRequest } from '../utils'

function testRun(
  cmd: 'pnpm run dev:server' | 'pnpm run dev' | 'pnpm run preview' | 'pnpm run prod',
  pageContextInitIsPassedToClient = false,
) {
  run(cmd)

  // See `someFakeData` in server/index.js
  const isMakingPageContextJsonRequest = cmd === 'pnpm run dev:server' || cmd === 'pnpm run prod'
  const isDev = cmd === 'pnpm run dev' || cmd === 'pnpm run dev:server'

  test('HTML', async () => {
    const t = async (url: string) => {
      const html = await fetchHtml(url)
      expect(html).toContain('<h1>Welcome</h1>')
    }
    await t('/')
    await t('/render-homepage')
    await t('/redirect')
  })

  test('DOM', async () => {
    const t = async (url: string) => {
      await page.goto(getServerUrl() + url)
      expect(await page.textContent('h1')).toBe('Welcome')
      await testCounter()
    }
    await t('/')
    await t('/render-homepage')
    await t('/redirect')
  })

  test('rewrite - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    expect(await page.textContent('h1')).toBe('About')
    await hydrationDone()
    const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
    await page.click('a[href="/render-homepage"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await testCounter()
    done()
    await ensureWasClientSideRouted('/pages/about')
  })

  test('redirect - server-side', async () => {
    await page.goto(getServerUrl() + '/redirect')
    await expectUrl('/')
  })

  test('redirect - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    await expectUrl('/about')
    await hydrationDone()
    const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
    await page.click('a[href="/redirect"]')
    await expectUrl('/')
    await testCounter()
    done()
    await ensureWasClientSideRouted('/pages/about')
  })

  {
    const url = getServerUrl() + '/show-error-page'
    const expectErrServer = () => {
      // Maybe we should also show a log in production?
      if (cmd === 'pnpm run prod') return
      expectLog(partRegex`HTTP response ${/.*/} /show-error-page 499`, { filter: (log) => log.logSource === 'stderr' })
    }
    const expectErrClient = () =>
      expectLog('Failed to load resource: the server responded with a status of 499 (unknown)', {
        filter: (log) =>
          log.logSource === 'Browser Error' && partRegex`http://${/[^\/]+/}:3000/show-error-page`.test(log.logInfo),
      })
    test('render error page - HTML', async () => {
      const response = await fetch(url)
      expect(response.status).toBe(499)
      expectErrServer()
      expectLog('Unexpected status code 499', { filter: (log) => log.logSource === 'stderr' })
      const html = await response.text()
      expect(html).toContain('Testing throw render error page.')
      expect(html).toContain('<p style="font-size:1.3em">Testing throw render error page.</p>')
      expect(html).toContain('"abortReason":"Testing throw render error page."')
    })

    test('render error page - server-side routing', async () => {
      await page.goto(url)
      expectErrServer()
      expectErrClient()
      await testCounter()
      await expectUrl('/show-error-page')
    })

    test('render error page - client-side routing', async () => {
      await page.goto(getServerUrl() + '/about')
      await expectUrl('/about')
      await hydrationDone()
      const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
      const pageContextJsonRequests: string[] = []
      const onRequest = (request: { url(): string }) => {
        if (new URL(request.url()).pathname.endsWith('.pageContext.json')) pageContextJsonRequests.push(request.url())
      }
      page.on('request', onRequest)
      await page.click('a[href="/show-error-page"]')
      await testCounter()
      page.off('request', onRequest)
      done()
      // One `.pageContext.json` request:
      // - If pageContextInitIsPassedToClient, the page's request: guard() runs on the server-side, and its response carries the error page's pageContext
      // - Otherwise, the error page's request: guard() runs on the client-side
      expect(pageContextJsonRequests.length).toBe(1)
      expect(await page.textContent('p')).toBe('Testing throw render error page.')
      expect(await page.textContent('#data')).toBe(
        '{"abortStatusCode":499,"abortReason":"Testing throw render error page."}',
      )
      await expectUrl('/show-error-page')
      await ensureWasClientSideRouted('/pages/about')
      if (
        // guard() is called on the client-side => warning is shown on the server-side (not on the client-side)
        !isMakingPageContextJsonRequest &&
        // The warning isn't shown on the client-side in production
        isDev
      )
        expectLog('Unexpected status code 499', { filter: (log) => log.logSource === 'Browser Warning' })
    })
  }

  test('render(404) - client-side routing', async () => {
    await page.goto(getServerUrl() + '/about')
    await expectUrl('/about')
    await hydrationDone()
    const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
    await page.click('a[href="/render-404"]')
    await autoRetry(async () => {
      expect(await page.textContent('p')).toBe('Page not found.')
    })
    expect(await page.textContent('#data')).toBe('{"abortStatusCode":404}')
    done()
    await expectUrl('/render-404')
    await ensureWasClientSideRouted('/pages/about')
  })

  test('permanent redirect', async () => {
    const url = getServerUrl() + '/permanent-redirect'
    // server-side
    const resp = await fetch(url, { redirect: 'manual' })
    expect(resp.status).toBe(301)
    // client-side
    await page.click('a[href="/permanent-redirect"]')
    await expectUrl('/')
  })

  test('external redirect - client-side', async () => {
    await page.goto(getServerUrl() + '/')
    await hydrationDone()
    await page.click('a[href="/redirect-external"]')
    await page.waitForURL('https://brillout.github.io/star-wars/')
  })
  test('external redirect - server-side', async () => {
    await page.goto(getServerUrl() + '/redirect-external')
    await page.waitForURL('https://brillout.github.io/star-wars/')
  })

  test('permanent external redirect', async () => {
    const url = getServerUrl() + '/permanent-redirect'
    // server-side
    const resp = await fetch(url, { redirect: 'manual' })
    expect(resp.status).toBe(301)
    // client-side
    await page.goto(getServerUrl() + '/')
    await hydrationDone()
    await page.click('a[href="/star-wars-api/films/1.json"]')
    await page.waitForURL('https://brillout.github.io/star-wars/api/films/1.json')
  })

  test('throw abort() - link', async () => {
    await page.goto(getServerUrl() + '/abort-navigation')
    await hydrationDone()
    // Prefetching links (upon hover and when they're in the viewport) calls onBeforeRoute() with `pageContext.isPrefetch === true`
    let prefetchDialogs = 0
    const onPrefetchDialog = async (dialog: { dismiss(): Promise<void> }) => {
      prefetchDialogs++
      await dialog.dismiss()
    }
    page.on('dialog', onPrefetchDialog)
    await page.hover('a[href="/"]')
    await page.waitForTimeout(1000)
    page.off('dialog', onPrefetchDialog)
    expect(prefetchDialogs).toBe(0)
    let dialog = answerConfirm(false)
    await page.click('a[href="/"]')
    await dialog
    await expectUrl('/abort-navigation')
    // Neither re-rendered nor reloaded
    await testCounter(1)
    // The next navigation calls onBeforeRoute() again
    dialog = answerConfirm(true)
    await page.click('a[href="/"]')
    await dialog
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await ensureWasClientSideRouted('/pages/abort-navigation')
  })

  test('throw abort() - back navigation', async () => {
    await page.goto(getServerUrl() + '/')
    await hydrationDone()
    await page.click('a[href="/about"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })
    await page.click('a[href="/abort-navigation"]')
    await testCounter()
    const dialog = answerConfirm(false)
    // Jump back over two history entries
    await page.evaluate(() => window.history.go(-2))
    await dialog
    // Vike reverts the URL
    await expectUrl('/abort-navigation')
    await testCounter(1)
    await ensureWasClientSideRouted('/pages/index')
  })

  {
    const url = getServerUrl() + '/throw-after-render'
    const expectErrThrown = () => autoRetry(() => expectBrowserError('Thrown after render'))

    test('handleError() - UI component throws after its page rendered', async () => {
      await page.goto(url)
      await hydrationDone()
      const historyLength = await page.evaluate(() => window.history.length)
      await page.click('#throw')
      await autoRetry(async () => {
        expect(await page.textContent('p')).toBe('Something went wrong.')
      })
      expect(await page.textContent('#data')).toBe('{}')
      await testCounter()
      await expectErrThrown()
      await expectUrl('/throw-after-render')
      expect(await page.evaluate(() => window.history.length)).toBe(historyLength)
      await ensureWasClientSideRouted('/pages/throw-after-render')
    })

    test("handleError() - no hard reload when the error page's .pageContext.json is missing", async () => {
      const glob = '**/*.pageContext.json*'
      await page.route(glob, (route) => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not Found' }))
      await page.goto(url)
      await hydrationDone()
      const stopCounting = countDocumentRequests()
      await page.click('#throw')
      await expectErrThrown()
      await autoRetry(() => expectBrowserError("couldn't be fetched"))
      await page.unroute(glob)
      expect(stopCounting()).toBe(0)
      expectBrowserError('Failed to load resource: the server responded with a status of 404')
    })

    test("handleError() - no hard reload when `throw render('/some-url')` can't be rendered on the client-side", async () => {
      const stopCounting = countDocumentRequests()
      await page.goto(url + '?render-url') // The page throws on its own after every load
      await sleep(1500) // Long enough for several reloads
      expect(stopCounting()).toBe(1)
      expect(await page.textContent('p')).toBe('Something went wrong.')
      await expectUrl('/throw-after-render?render-url')
      await autoRetry(() => expectBrowserError("/does-not-exist can't be rendered on the client-side"))
    })

    test('handleError() - UI component throws `null`', async () => {
      await page.goto(url + '?null') // The page throws on its own after every load
      await autoRetry(async () => {
        expect(await page.textContent('p')).toBe('Something went wrong.')
      })
      expectBrowserError('The thrown value is `null`')
    })

    test('handleError() - a value that a newer rendering replaces is logged', async () => {
      await page.goto(url + '?two-values')
      await autoRetry(() => expectBrowserError('First value'))
      expectBrowserError('Second value')
      await autoRetry(() => expectLog('handleError() settled'))
    })

    test('handleError() - a value handed over once the error page is shown is logged', async () => {
      await page.goto(url)
      await hydrationDone()
      await page.click('#value-after-error-page')
      await autoRetry(() => expectLog('handleError() settled'))
      // Not the render(404) handed over second
      expect(await page.textContent('p')).toBe('Something went wrong.')
      expectBrowserError('First value')
      expectBrowserError('AbortRender')
    })

    if (isMakingPageContextJsonRequest) {
      test("handleError() - no hard reload when the .pageContext.json of `throw render('/some-url')` is missing", async () => {
        const glob = '**/about/index.pageContext.json'
        await page.route(glob, (route) => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not Found' }))
        const stopCounting = countDocumentRequests()
        await page.goto(url + '?render-about') // The page throws on its own after every load
        await sleep(1500) // Long enough for several reloads
        await page.unroute(glob)
        expect(stopCounting()).toBe(1)
        expect(await page.textContent('p')).toBe('Something went wrong.')
        expectBrowserError("couldn't be fetched")
        expectBrowserError('Failed to load resource: the server responded with a status of 404')
      })
    }

    test("handleError() - `throw redirect('/some-url')` can hard load a page the client can't render", async () => {
      await page.goto(url + '?redirect-html-only')
      await expectUrl('/html-only')
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('HTML only')
      })
    })

    // Static assets are hard reloaded only in production
    if (!isDev) {
      test("handleError() - no hard reload loop when the error page's JavaScript is missing", async () => {
        const glob = '**/assets/entries/pages_error.*.js'
        await page.route(glob, (route) => route.abort())
        const stopCounting = countDocumentRequests()
        await page.goto(url + '?late') // The page throws on its own after every load
        await sleep(1500) // Long enough for several reloads
        await page.unroute(glob)
        expect(stopCounting()).toBe(1)
        await expectErrThrown()
        await autoRetry(() => expectBrowserError('Failed to fetch dynamically imported module'))
        expectBrowserError('Failed to load resource: net::ERR_FAILED')
      })

      test('handleError() - no hard reload loop after a failed prefetch disabled client routing', async () => {
        const glob = '**/assets/entries/pages_about.*.js'
        await page.route(glob, (route) => route.abort())
        const stopCounting = countDocumentRequests()
        await page.goto(url + '?late-after-prefetch') // The prefetch fails, then the page throws, after every load
        await sleep(1500) // Long enough for several reloads
        await page.unroute(glob)
        expect(stopCounting()).toBe(1)
        expect(await page.textContent('p')).toBe('Something went wrong.')
        await expectErrThrown()
        expectBrowserError('Failed to load resource: net::ERR_FAILED')
      })

      test('handleError() - the first render failed for good', async () => {
        const urlFailing = url + '?early-listener'
        const glob = '**/assets/entries/pages_throw-after-render.*.js'
        await page.route(glob, (route) => route.abort())
        // The connection is down => Vike keeps the rendered HTML instead of reloading
        await page.route(urlFailing, (route) =>
          route.request().method() === 'HEAD' ? route.abort() : route.continue(),
        )
        const stopCounting = countDocumentRequests()
        await page.goto(urlFailing) // The rejected first render reaches handleError()
        await autoRetry(() => expectLog('handleError() settled'))
        await page.unroute(glob)
        await page.unroute(urlFailing)
        expect(stopCounting()).toBe(1)
        expect(await page.textContent('p')).toBe('Something went wrong.')
        expectBrowserError('Failed to fetch dynamically imported module')
        expectBrowserError('Failed to load resource: net::ERR_FAILED')
      })
    }
  }

  test('+onRenderClient throws `null`', async () => {
    await page.goto(getServerUrl() + '/about?on-render-client-null')
    await autoRetry(async () => {
      expect(await page.textContent('p')).toBe('Something went wrong.')
    })
    expectBrowserError('The thrown value is `null`')
  })
}

async function hydrationDone() {
  await testCounter()
}

function expectBrowserError(logText: string) {
  expectLog(logText, { filter: (log) => log.logSource === 'Browser Error' })
}

function countDocumentRequests() {
  let count = 0
  const onRequest = (request: { isNavigationRequest(): boolean }) => {
    if (request.isNavigationRequest()) count++
  }
  page.on('request', onRequest)
  return () => {
    page.off('request', onRequest)
    return count
  }
}

// Click on Cancel (or OK) of the next window.confirm() dialog
function answerConfirm(accept: boolean) {
  return new Promise<void>((resolve) => {
    page.once('dialog', async (dialog) => {
      await (accept ? dialog.accept() : dialog.dismiss())
      resolve()
    })
  })
}
