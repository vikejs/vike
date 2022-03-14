import { page, run, partRegex, autoRetry, fetchHtml, urlBase, expectBrowserError } from '../libframe/test/setup'

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run prod' | 'pnpm run dev' | 'pnpm run prod',
  {
    skipTitleColorTest,
    cwd,
    noDefaultPageInUserCode,
  }: { skipTitleColorTest?: boolean; cwd?: string; noDefaultPageInUserCode?: true } = {},
) {
  run(cmd, { cwd })

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    // Vue injects: `!--[-->Home<!--]-->`
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}Home${/.*/}</a>`)
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}About${/.*/}</a>`)
  })

  test('production asset preloading', async () => {
    const isProduction = cmd === 'npm run prod' || 'pnpm run prod'
    const html = await fetchHtml('/')

    if (!isProduction) {
      expect(html).toContain('<script type="module" src="/@vite/client"></script>')
      return
    } else {
      expect(html).not.toContain('<script type="module" src="/@vite/client"></script>')
    }

    const hashRegexp = /[a-z0-9]+/
    expect(html).toMatch(partRegex`<link rel="icon" href="/assets/logo.${hashRegexp}.svg" />`)
    expect(html).toMatch(
      partRegex`<link rel="preload" href="/assets/logo.${hashRegexp}.svg" as="image" type="image/svg+xml">`,
    )
    try {
      expect(html).toMatch(partRegex`<script type="module" src="/assets/entry-client-routing.${hashRegexp}.js">`)
      expect(html).toMatch(
        partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/entry-client-routing.${hashRegexp}.js">`,
      )
    } catch (err) {
      expect(html).toMatch(partRegex`<script type="module" src="/assets/entry-server-routing.${hashRegexp}.js">`)
      expect(html).toMatch(
        partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/entry-server-routing.${hashRegexp}.js">`,
      )
    }
    expect(html).toMatch(
      partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/chunk-${hashRegexp}.js">`,
    )
    expect(html).toMatch(
      partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/index.page.${hashRegexp}.js">`,
    )
    if (!noDefaultPageInUserCode) {
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/_default.page.client.${hashRegexp}.css">`,
      )
      expect(html).toMatch(
        partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/_default.page.client.${hashRegexp}.js">`,
      )
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('about page', async () => {
    await page.click('a[href="/about"]')
    await autoRetry(async () => {
      const title = await page.textContent('h1')
      expect(title).toBe('About')
    })
    // CSS is loaded only after being dynamically `import()`'d from JS
    await autoRetry(async () => {
      if (skipTitleColorTest) {
        return
      }
      const titleColor = await page.$eval('h1', (e) => getComputedStyle(e).color)
      expect(titleColor).toBe('rgb(0, 128, 0)')
    })
  })

  test('active links', async () => {
    // Not sure why `autoRetry()` is needed here; isn't the CSS loading already awaited for in the previous `test()` call?
    await autoRetry(async () => {
      expect(await page.$eval('a[href="/about"]', (e) => getComputedStyle(e).backgroundColor)).toBe(
        'rgb(238, 238, 238)',
      )
      expect(await page.$eval('a[href="/"]', (e) => getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
    })
  })

  test('error page', async () => {
    await page.goto(urlBase + '/does-not-exist')
    expect(await page.textContent('h1')).toBe('404 Page Not Found')
    expect(await page.textContent('p')).toBe('This page could not be found.')
    expectBrowserError(
      (browserLog) =>
        browserLog.logText.includes('http://localhost:3000/does-not-exist') &&
        browserLog.logText.includes('Failed to load resource: the server responded with a status of 404 (Not Found)'),
    )
  })
}
