export { testRun }

import {
  page,
  test,
  expect,
  run,
  autoRetry,
  fetchHtml,
  getServerUrl,
  testScreenshotFixture,
  expectLog,
  pc
} from '@brillout/test-e2e'
import path from 'path'
import url from 'url'
import { createRequire } from 'module'

function testRun(
  cmd: 'npm run dev' | 'npm run preview' | 'npm run prod',
  {
    isCJS,
    skipScreenshotTest,
    screenshotFixture
  }: { isCJS?: true; skipScreenshotTest?: true; screenshotFixture?: string } = {}
) {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
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

  if (!skipScreenshotTest) {
    test('screenshot fixture', async () => {
      {
        const { platform } = process
        if (!['linux', 'win32', 'darwin'].includes(platform))
          throw new Error(`Unexpected operating system platform name ${pc.bold(platform)}`)
        if (platform !== 'linux') return
        /*
        if (process.env.VITE_ECOSYSTEM_CI) {
          console.log(
            `\n${pc.blue('INFO')} test screenshot fixture ${pc.bold('skipped')} because running in Vite Ecosystem CI.`
          )
          return
        }
        */
      }
      {
        const dirname = path.dirname(url.fileURLToPath(import.meta.url))
        // dirname isn't the directory of this file: because this file is bundled with the entry, e.g. dirname is the directory examples/react-streaming/ of the entry /examples/react-streaming/.test-dev.test.ts
        const repoRoot = path.join(dirname, `../../`)
        const screenshotFixturePathUnresolved = path.join(
          repoRoot,
          screenshotFixture || 'examples/react-minimal/.test-screenshot-fixture.png'
        )
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
        await testScreenshotFixture({ screenshotFixturePath, doNotTestLocally: true })
      }
    })
  }

  test('about page', async () => {
    await page.click('a[href="/about"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })
    expect(await page.textContent('p')).toBe('Example of using Vike.')
    const html = await fetchHtml('/about')
    expect(html).toContain('<h1>About</h1>')
  })
}
