export { testRun as test }

import {
  run,
  page,
  test,
  expect,
  getServerUrl,
  fetchHtml,
  expectLog,
  autoRetry,
  editFile,
  editFileRevert,
} from '@brillout/test-e2e'
import {
  ensureWasClientSideRouted,
  expectPageContextJsonRequest,
  expectUrl,
  sleepBeforeEditFile,
  testCounter,
  waitForNavigation,
} from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview' | 'pnpm run preview:ssg') {
  run(cmd)

  const isDev = cmd === 'pnpm run dev'

  test('HTML', async () => {
    const t = async (
      url: string,
      v1: string,
      v2: string,
      v3: string,
      v4: string,
      v5: string,
      v6: string,
      v7: string,
      v8: string,
    ) => {
      const html = await fetchHtml(url)
      expect(html).toContain(`<p>global data() was called: <!-- -->${v1}</p>`)
      expect(html).toContain(`<p>global data() was called in env: <!-- -->${v2}</p>`)
      expect(html).toContain(`<p>per-page data() was called: <!-- -->${v3}</p>`)
      expect(html).toContain(`<p>per-page data() was called in env: <!-- -->${v4}</p>`)
      expect(html).toContain(`<p>global onBeforeRender() was called: <!-- -->${v5}</p>`)
      expect(html).toContain(`<p>global onBeforeRender() was called in env: <!-- -->${v6}</p>`)
      expect(html).toContain(`<p>per-page onBeforeRender() was called: <!-- -->${v7}</p>`)
      expect(html).toContain(`<p>per-page onBeforeRender() was called in env: <!-- -->${v8}</p>`)
    }
    await t('/', 'true', 'server', 'undefined', 'undefined', 'true', 'server', 'undefined', 'undefined')
    await t(
      '/page-2',
      'undefined',
      'undefined',
      'undefined',
      'undefined',
      'undefined',
      'undefined',
      'undefined',
      'undefined',
    )
    await t('/page-3', 'undefined', 'undefined', 'true', 'server', 'true', 'server', 'undefined', 'undefined')
    await t('/page-4', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'true', 'server')
  })

  test('Request pageContext JSON only if necessary', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    {
      // because neither data() nor onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      // Wait for the navigation to finish: Vike changes the URL only after the pageContext JSON request (if any)
      await expectUrl('/page-4')
      await testCounter(1)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/page-3"]')
      await expectUrl('/page-3')
      await testCounter(2)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only, even though they are both null
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/page-2"]')
      await expectUrl('/page-2')
      await testCounter(3)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/"]')
      await expectUrl('/')
      await testCounter(4)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
  })

  test('client-only data()', async () => {
    expect(await page.textContent('body')).toContain('global data() was called: true')
    expect(await page.textContent('body')).toContain('global data() was called in env: server')
    expect(await page.textContent('body')).toContain('per-page data() was called: undefined')
    expect(await page.textContent('body')).toContain('per-page data() was called in env: undefined')
    {
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      await expectUrl('/page-4')
      await testCounter(5)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    expect(await page.textContent('body')).toContain('global data() was called: undefined')
    expect(await page.textContent('body')).toContain('global data() was called in env: undefined')
    expect(await page.textContent('body')).toContain('per-page data() was called: true')
    expect(await page.textContent('body')).toContain('per-page data() was called in env: client')
  })

  test('Request pageContext JSON only if necessary: onCreatePageContext() set by a Vite plugin', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await navigate('/mutable-page-config/a', false)
    await navigate('/mutable-page-config/b', true)
    await navigate('/', true)
  })

  if (isDev) {
    test('modifying a file read by the Vite plugin', async () => {
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFile('./pages/mutable-page-config/a/+Page.tsx', (s) => `// needs-server\n${s}`)
        await reloaded()
      }
      await testCounter()
      await navigate('/mutable-page-config/a', true)
      await navigate('/', true)
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFileRevert()
        await reloaded()
      }
      await testCounter()
      await navigate('/mutable-page-config/a', false)
      await navigate('/', true)
    })

    test('modifying a +config file', async () => {
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFile('./pages/+config.ts', (s) => `${s}// modified\n`)
        await reloaded()
      }
      expectLog('modified /pages/+config.ts')
      await testCounter()
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFileRevert()
        await reloaded()
      }
      await testCounter()
    })

    test('removing the Vite plugin from vite.config.ts', async () => {
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFile('./vite.config.ts', (s) =>
          s.replace('plugins: [vike(), react(), setOnCreatePageContext()]', 'plugins: [vike(), react()]'),
        )
        await reloaded()
      }
      await testCounter()
      await navigate('/mutable-page-config/b', false)
      await navigate('/', true)
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFileRevert()
        await reloaded()
      }
      await testCounter()
      await navigate('/mutable-page-config/b', true)
    })
  }

  /* Re-use this test for upcoming new error when requestPageContextOnNavigation is set to 'minimal' or false
  test('wrong hook suppressing usage', async () => {
    await fetchHtml('/page-2')
    await autoRetry(() => {
      expectLog(
        '[Wrong Usage] Set onBeforeRender to null in a +config.js file instead of /pages/page-2/+onBeforeRender.tsx',
        { filter: (log) => log.logSource === 'stderr' }
      )
    })
    await autoRetry(() => {
      expectLog('HTTP response', { filter: (log) => log.logSource === 'stderr' })
    })
    if (isDev) {
      expectLog('No error page found', { filter: (log) => log.logSource === 'stderr' })
    }
  })
  */
}

async function navigate(
  pathname: '/' | '/mutable-page-config/a' | '/mutable-page-config/b',
  isPageContextJsonRequest: boolean,
) {
  const done = expectPageContextJsonRequest(isPageContextJsonRequest)
  await page.click(`a[href="${pathname}"]`)
  await expectUrl(pathname)
  await autoRetry(async () => {
    expect(await page.textContent('h1')).toBe(
      { '/': 'Page', '/mutable-page-config/a': 'Page A', '/mutable-page-config/b': 'Page B' }[pathname],
    )
  })
  await ensureWasClientSideRouted('/pages/index')
  done()
}
