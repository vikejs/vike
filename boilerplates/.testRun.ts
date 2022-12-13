export { testRun }

import {
  page,
  run,
  partRegex,
  autoRetry,
  fetchHtml,
  getServerUrl,
  expectError,
  editFile,
  editFileRevert,
  sleep,
  test,
  expect
} from '@brillout/test-e2e'
import assert from 'assert'

function testRun(
  cmd: 'npm run dev' | 'npm run prod' | 'npm run preview',
  {
    skipCssTest,
    noDefaultPageInUserCode,
    uiFramewok,
    lang
  }: {
    skipCssTest?: boolean
    noDefaultPageInUserCode?: true
    uiFramewok: 'react' | 'vue' | 'preact'
    lang?: 'ts'
  }
) {
  run(cmd)

  const isProd = cmd === 'npm run prod' || cmd === 'npm run preview'
  const isDev = !isProd

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    // Vue injects: `!--[-->Home<!--]-->`
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}Home${/.*/}</a>`)
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}About${/.*/}</a>`)
  })

  test('production asset preloading', async () => {
    const html = await fetchHtml('/')

    {
      expect(html).not.toContain('<script type="module" src="/@vite/client"></script>')
      if (!isProd) {
        expect(html).toContain('import("/@vite/client");')
      } else {
        expect(html).not.toContain('/@vite/client')
      }
    }

    if (isProd) {
      const hashRegexp = /[a-z0-9]+/
      expect(html).toMatch(partRegex`<link rel="icon" href="/assets/logo.${hashRegexp}.svg" />`)

      try {
        expect(html).toMatch(
          partRegex`<script type="module" src="/assets/entry-client-routing.${hashRegexp}.js" async>`
        )
      } catch (err) {
        expect(html).toMatch(
          partRegex`<script type="module" src="/assets/entry-server-routing.${hashRegexp}.js" async>`
        )
      }

      expect(html).toMatch(
        partRegex`<link rel="modulepreload" href="/assets/chunk-${hashRegexp}.js" as="script" type="text/javascript">`
      )
      expect(html).toMatch(
        partRegex`<link rel="modulepreload" href="/assets/pages/index/index.page.${hashRegexp}.js" as="script" type="text/javascript">`
      )
      expect(html).not.toMatch(
        partRegex`<link rel="modulepreload" href="/assets/pages/about/index.page.${hashRegexp}.js" as="script" type="text/javascript">`
      )
      if (!noDefaultPageInUserCode) {
        try {
          expect(html).toMatch(
            partRegex`<link rel="stylesheet" type="text/css" href="/assets/PageShell.${hashRegexp}.css">`
          )
        } catch {
          try {
            // Vite 2
            expect(html).toMatch(
              partRegex`<link rel="stylesheet" type="text/css" href="/assets/renderer/_default.page.client.${hashRegexp}.css">`
            )
          } catch {
            // Vite 3 (not sure why it differs from Vite 2)
            expect(html).toMatch(
              partRegex`<link rel="stylesheet" type="text/css" href="/assets/_default.page.client.${hashRegexp}.css">`
            )
          }
        }
        expect(html).toMatch(
          partRegex`<link rel="modulepreload" href="/assets/renderer/_default.page.client.${hashRegexp}.js" as="script" type="text/javascript">`
        )
      }
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })

  if (isDev && (uiFramewok === 'react' || uiFramewok === 'vue')) {
    test('HMR', async () => {
      const file = (() => {
        if (uiFramewok === 'vue') {
          return './pages/index/index.page.vue'
        }
        if (uiFramewok === 'react') {
          if (lang === 'ts') {
            return './pages/index/index.page.tsx'
          } else {
            return './pages/index/index.page.jsx'
          }
        }
        assert(false)
      })()
      expect(await page.textContent('button')).toBe('Counter 1')
      expect(await page.textContent('h1')).toBe('Welcome')
      await sleep(2 * 1000) // timeout can probably be decreased
      editFile(file, (s) => s.replace('Welcome', 'Welcome !'))
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('Welcome !')
      })
      expect(await page.textContent('button')).toBe('Counter 1')
      await sleep(300)
      editFileRevert()
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('Welcome')
      })
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  }

  test('about page', async () => {
    await page.click('a[href="/about"]')
    await autoRetry(async () => {
      const title = await page.textContent('h1')
      expect(title).toBe('About')
    })
    // CSS is loaded only after being dynamically `import()`'d from JS
    await autoRetry(async () => {
      if (skipCssTest) {
        return
      }
      expect(await page.$eval('code', (e) => getComputedStyle(e).backgroundColor)).toBe('rgb(234, 234, 234)')
    })
  })

  test('active links', async () => {
    // Not sure why `autoRetry()` is needed here; isn't the CSS loading already awaited for in the previous `test()` call?
    await autoRetry(async () => {
      expect(await page.$eval('a[href="/about"]', (e) => getComputedStyle(e).backgroundColor)).toBe(
        'rgb(238, 238, 238)'
      )
      expect(await page.$eval('a[href="/"]', (e) => getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
    })
  })

  test('error page', async () => {
    await page.goto(getServerUrl() + '/does-not-exist')
    expect(await page.textContent('h1')).toBe('404 Page Not Found')
    expect(await page.textContent('p')).toBe('This page could not be found.')
    expectError(
      (log) =>
        log.logSource === 'Browser Error' &&
        partRegex`http://${/[^\/]+/}:3000/does-not-exist`.test(log.logText) &&
        log.logText.includes('Failed to load resource: the server responded with a status of 404 (Not Found)')
    )
  })
}
