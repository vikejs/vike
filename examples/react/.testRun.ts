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
  testScreenshotFixture,
  expectLog
} from '@brillout/test-e2e'
import path from 'path'
import url from 'url'
import { createRequire } from 'module'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod', isCJS?: true) {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expectHtmlCommon(html)
    if (isCJS) {
      expectLog('package.json#type to "module", see https://vike.dev/CJS', (log) => log.logSource === 'stderr')
    }
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
      // dirname isn't the directory of this file: because this file is bundled with the entry, e.g. dirname is the directory examples/react-streaming/ of the entry /examples/react-streaming/.test-dev.test.ts
      const repoRoot = path.join(dirname, `../../`)
      const screenshotFixturePathUnresolved = path.join(repoRoot, 'examples/react/.test-screenshot-fixture.png')
      const require = createRequire(import.meta.url)
      let screenshotFixturePath: string
      try {
        screenshotFixturePath = require.resolve(screenshotFixturePathUnresolved)
      } catch (err) {
        console.log('dirname:', dirname)
        console.log('repoRoot:', repoRoot)
        console.log('screenshotFixturePathUnresolved:', screenshotFixturePathUnresolved)
        throw err
      }
      await testScreenshotFixture({ screenshotFixturePath })
    }
  })

  test('about page', async () => {
    await page.click('a[href="/about"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })
    expect(await page.textContent('p')).toBe('Example of using Vike.')
    const html = await fetchHtml('/about')
    expect(html).toContain('<h1>About</h1>')
    expectHtmlCommon(html)
  })
}

function expectHtmlCommon(html: string) {
  // Vue injects: `!--[-->Home<!--]-->`
  expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}Home${/[.\s]*/}</a>`)
  expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}About${/[.\s]*/}</a>`)
  expect(html).toContain('<link rel="stylesheet" type="text/css"')
}
