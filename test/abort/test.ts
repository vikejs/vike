export { testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, expectLog, partRegex } from '@brillout/test-e2e'
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
      await page.click('a[href="/show-error-page"]')
      await testCounter()
      done()
      expect(await page.textContent('p')).toBe('Testing throw render error page.')
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

  test('throw abort() - guard()', async () => {
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await waitForPageTransitionEnd(() => page.click('a[href="/abort-navigation"]'))
    await expectUrl('/about')
    expect(await page.textContent('h1')).toBe('About')
    // Same page instance: it wasn't reloaded
    await testCounter(1)
    // Client-side navigation still works
    await page.click('a[href="/"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await ensureWasClientSideRouted('/pages/about')
  })

  test('throw abort() - onBeforeRoute() with unsaved changes', async () => {
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await page.click('a[href="/unsaved-changes"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Unsaved changes')
    })
    await testCounter()
    await page.check('input[type="checkbox"]')

    // The user cancels => link navigation is aborted
    page.once('dialog', (dialog) => dialog.dismiss())
    await waitForPageTransitionEnd(() => page.click('a[href="/"]'))
    await expectUrl('/unsaved-changes')

    // The user cancels => back navigation is aborted and the URL is restored
    page.once('dialog', (dialog) => dialog.dismiss())
    await waitForPageTransitionEnd(async () => {
      await page.goBack()
    })
    await expectUrl('/unsaved-changes')
    expect(await page.textContent('h1')).toBe('Unsaved changes')
    await testCounter(1)

    // The user confirms => back navigation proceeds
    page.once('dialog', (dialog) => dialog.accept())
    await page.goBack()
    await expectUrl('/about')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })
    await ensureWasClientSideRouted('/pages/about')
  })

  test('throw abort() - hydration', async () => {
    await page.goto(getServerUrl() + '/abort-navigation')
    await autoRetry(async () => {
      expectLog('`throw abort()` aborts client-side navigation: it cannot be used upon hydration', {
        filter: (log) => log.logSource === 'Browser Error',
      })
    })
  })
}

async function hydrationDone() {
  await testCounter()
}

// Waits until onPageTransitionEnd() removed the CSS class that onPageTransitionStart() added
async function waitForPageTransitionEnd(navigate: () => Promise<void>) {
  await page.evaluate(() => {
    window._pageTransitionEnded = false
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('page-transition')) return
      observer.disconnect()
      window._pageTransitionEnded = true
    })
    observer.observe(document.body, { attributeFilter: ['class'] })
  })
  await navigate()
  await page.waitForFunction(() => window._pageTransitionEnded)
}
declare global {
  var _pageTransitionEnded: boolean | undefined
}
