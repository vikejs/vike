import { page, run, partRegExp, autoRetry, fetchHtml } from '../tests/setup'

export { testPages }

function testPages(
  cmd: 'npm run dev' | 'npm run prod',
  viewFramework: 'vue' | 'react'
) {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain('<h1>Welcome</h1>')
    if (viewFramework === 'vue') {
      expect(html).toMatch(partRegExp`<a href="/" data-v-${/[^\>]*/}>Home</a>`)
      expect(html).toMatch(
        partRegExp`<a href="/about" data-v-${/[^\>]*/}>About</a>`
      )
    } else {
      expect(html).toContain('<a href="/">Home</a>')
      expect(html).toContain('<a href="/about">About</a>')
    }
  })

  test('production asset preloading', async () => {
    const isProduction = cmd === 'npm run prod'
    const html = await fetchHtml('/')
    if (isProduction) {
      const hashRegexp = /[a-z0-9]+/
      const extRegexp = /[a-z]+/
      expect(html).toMatch(
        partRegExp`<link rel="icon" href="/assets/logo.${hashRegexp}.svg" />`
      )
      expect(html).toMatch(
        partRegExp`<link rel="stylesheet" href="/assets/pages/_default/_default.page.client.${extRegexp}.${hashRegexp}.css">`
      )
      expect(html).toMatch(
        partRegExp`<link rel="preload" href="/assets/logo.${hashRegexp}.svg">`
      )
      expect(html).toMatch(
        partRegExp`<script type="module" src="/assets/pages/_default/_default.page.client.${extRegexp}.${hashRegexp}.js">`
      )
      expect(html).toMatch(
        partRegExp`<link rel="modulepreload" crossorigin href="/assets/pages/_default/_default.page.client.${extRegexp}.${hashRegexp}.js">`
      )
      expect(html).not.toContain(
        '<script type="module" src="/@vite/client"></script>'
      )
    } else {
      expect(html).toContain(
        '<script type="module" src="/@vite/client"></script>'
      )
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
      expect(await page.$eval('h1', (e) => getComputedStyle(e).color)).toBe(
        'rgb(0, 128, 0)'
      )
    })
  })
}
