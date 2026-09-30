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

  test('Set-Cookie before redirect - server-side', async () => {
    const resp = await fetch(getServerUrl() + '/redirect-with-cookie', { redirect: 'manual' })
    expect(resp.status).toBe(302)
    expect(resp.headers.get('Location')).toBe('/')
    expectSetCookie(resp, ['cookie-set-by-guard=1; Path=/', 'cookie-set-by-guard-2=1; Path=/'])
    await page.context().clearCookies()
    await page.goto(getServerUrl() + '/redirect-with-cookie')
    await expectUrl('/')
    await expectCookie('cookie-set-by-guard')
    await expectCookie('cookie-set-by-guard-2')
  })

  test('Set-Cookie before redirect - client-side', async () => {
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await page.context().clearCookies()
    await page.click('a[href="/redirect-with-cookie"]')
    await expectUrl('/')
    await testCounter()
    await ensureWasClientSideRouted('/pages/about')
    await expectCookie('cookie-set-by-guard')
    await expectCookie('cookie-set-by-guard-2')
  })

  test('Set-Cookie in data() - client-side', async () => {
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await page.context().clearCookies()
    await page.click('a[href="/data-with-cookie"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Data with cookie')
    })
    await testCounter()
    await ensureWasClientSideRouted('/pages/about')
    await expectCookie('cookie-set-by-data')
  })

  test('Set-Cookie before render(url)', async () => {
    const resp = await fetch(getServerUrl() + '/rewrite-with-cookie')
    expect(resp.status).toBe(200)
    expect(await resp.text()).toContain('<h1>Welcome</h1>')
    expectSetCookie(resp, ['cookie-set-before-rewrite=1; Path=/'])
    // Client-side
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await page.context().clearCookies()
    await page.click('a[href="/rewrite-with-cookie"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await ensureWasClientSideRouted('/pages/about')
    await expectCookie('cookie-set-before-rewrite')
  })

  test('Set-Cookie before render(abortStatusCode)', async () => {
    const resp = await fetch(getServerUrl() + '/render-status-with-cookie')
    expect(resp.status).toBe(403)
    if (cmd !== 'pnpm run prod') {
      expectLog(partRegex`HTTP response ${/.*/} /render-status-with-cookie 403`, {
        filter: (log) => log.logSource === 'stderr',
      })
    }
    expect(await resp.text()).toContain('Testing cookie before throw render().')
    expectSetCookie(resp, ['cookie-set-before-render=1; Path=/'])
    // Client-side
    await page.goto(getServerUrl() + '/about')
    await hydrationDone()
    await page.context().clearCookies()
    await page.click('a[href="/render-status-with-cookie"]')
    await autoRetry(async () => {
      expect(await page.textContent('p')).toBe('Testing cookie before throw render().')
    })
    await ensureWasClientSideRouted('/pages/about')
    await expectCookie('cookie-set-before-render')
  })

  test('Set-Cookie before the error page aborts', async () => {
    {
      // The error page (pages/_error/+onRenderHtml.tsx) sets a cookie and throws redirect()
      const resp = await fetch(getServerUrl() + '/error-page-redirect-with-cookie', { redirect: 'manual' })
      expect(resp.status).toBe(302)
      expect(resp.headers.get('Location')).toBe('/')
      expectSetCookie(resp, ['cookie-set-by-page=1; Path=/', 'cookie-set-by-error-page=1; Path=/'])
    }
    {
      // The error page throws render(500) => Vike's generic error page
      const resp = await fetch(getServerUrl() + '/error-page-render-with-cookie')
      expect(resp.status).toBe(500)
      expectLog('Failed to render error page because render(500) was called', {
        filter: (log) => log.logSource === 'stderr',
      })
      if (cmd !== 'pnpm run prod') {
        expectLog(partRegex`HTTP response ${/.*/} /error-page-render-with-cookie 500`, {
          filter: (log) => log.logSource === 'stderr',
        })
      }
      expect(await resp.text()).toContain('An error occurred.')
      expectSetCookie(resp, ['cookie-set-by-page=1; Path=/'])
    }
  })

  {
    const url = getServerUrl() + '/show-error-page'
    const expectErrServer = () => {
      // Maybe we should also show a log in production?
      if (cmd === 'pnpm run prod') return
      expectLog(partRegex`HTTP response ${/.*/} /show-error-page 666`, { filter: (log) => log.logSource === 'stderr' })
    }
    const expectErrClient = () =>
      expectLog('Failed to load resource: the server responded with a status of 666 (unknown)', {
        filter: (log) =>
          log.logSource === 'Browser Error' && partRegex`http://${/[^\/]+/}:3000/show-error-page`.test(log.logInfo),
      })
    test('render error page - HTML', async () => {
      const response = await fetch(url)
      expect(response.status).toBe(666)
      expectErrServer()
      expectLog('Unexpected status code 666', { filter: (log) => log.logSource === 'stderr' })
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
        expectLog('Unexpected status code 666', { filter: (log) => log.logSource === 'Browser Warning' })
    })
  }

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
}

async function hydrationDone() {
  await testCounter()
}

function expectSetCookie(resp: Response, setCookie: string[]) {
  expect(JSON.stringify(resp.headers.getSetCookie())).toBe(JSON.stringify(setCookie))
}

async function expectCookie(name: string) {
  await autoRetry(async () => {
    const cookies = await page.context().cookies()
    expect(cookies.find((cookie) => cookie.name === name)?.value).toBe('1')
  })
}
