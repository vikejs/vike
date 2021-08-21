import { page, run, partRegex, autoRetry, fetchHtml } from '../libframe/test/setup'

export { testPages }

function testPages(cmd: 'npm run dev' | 'npm run prod', viewFramework: 'vue' | 'react') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain('<a class="navitem"')
  })

  test('production asset preloading', async () => {
    const isProduction = cmd === 'npm run prod'
    const html = await fetchHtml('/')
    if (isProduction) {
      const hashRegexp = /[a-z0-9]+/
      const extRegexp = /[a-z]+/
      expect(html).toMatch(partRegex`<link rel="icon" href="/assets/logo.${hashRegexp}.svg" />`)
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/pages/_default/_default.page.client.${extRegexp}.${hashRegexp}.css">`
      )
      expect(html).toMatch(
        partRegex`<link rel="preload" href="/assets/logo.${hashRegexp}.svg" as="image" type="image/svg+xml">`
      )
      expect(html).toMatch(
        partRegex`<script type="module" src="/assets/pages/_default/_default.page.client.${extRegexp}.${hashRegexp}.js">`
      )
      expect(html).toMatch(
        partRegex`<link rel="modulepreload" as="script" type="text/javascript" href="/assets/vendor.${hashRegexp}.js">`
      )
      expect(html).not.toContain('<script type="module" src="/@vite/client"></script>')
    } else {
      expect(html).toContain('<script type="module" src="/@vite/client"></script>')
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.click('a[href="/"]')
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
    expect(await page.textContent('h1')).toBe('About')
    // CSS is loaded only after being dynamically `import()`'d from JS
    await autoRetry(async () => {
      expect(await page.$eval('h1', (e) => getComputedStyle(e).color)).toBe('rgb(0, 128, 0)')
    })
  })

  test('active links', async () => {
    expect(await page.$eval('a[href="/about"]', (e) => getComputedStyle(e).backgroundColor)).toBe('rgb(238, 238, 238)')
    expect(await page.$eval('a[href="/"]', (e) => getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  })
}
