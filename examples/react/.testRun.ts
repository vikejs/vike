export { testRun }

import {
  page,
  test,
  expect,
  run,
  partRegex,
  autoRetry,
  fetchHtml,
  getServerUrl,
  testScreenshotFixture
} from '@brillout/test-e2e'
import path from 'path'
import url from 'url'
import { createRequire } from 'module'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expectHtmlCommon(html)
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })

  test('screenshot fixture', async () => {
    {
      const { platform } = process
      if (!['linux', 'win32', 'darwin'].includes(platform))
        throw new Error(`Unexpted platform operating system '${platform}'`)
      if (platform !== 'linux') return
    }
    {
      const dirname = path.dirname(url.fileURLToPath(import.meta.url))
      const require = createRequire(import.meta.url)
      let screenshotFixturePath: string
      try {
        // dirname isn't the directory of this file: because this file is bundled with the entry, e.g. dirname is the directory examples/react-17/ of the entry /examples/react-17/.test-dev.test.ts
        screenshotFixturePath = require.resolve(path.join(dirname, '../react/.test-screenshot-fixture.png'))
      } catch (err) {
        console.log('dirname:', dirname)
        throw err
      }
      await testScreenshotFixture({ screenshotFixturePath })
    }
  })

  test('about page', async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent('h1')).toBe('About')
    expect(await page.textContent('p')).toBe('Example of using VPS.')
    const html = await fetchHtml('/about')
    expect(html).toContain('<h1>About</h1>')
    expectHtmlCommon(html)
  })
}

function expectHtmlCommon(html: string) {
  // Vue injects: `!--[-->Home<!--]-->`
  expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}Home${/.*/}</a>`)
  expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}About${/.*/}</a>`)
  expect(html).toContain('<link rel="stylesheet" type="text/css"')
}
