export { testRun }

import { test, expect, fetch, fetchHtml, page, getServerUrl, autoRetry, expectLog, sleep } from '@brillout/test-e2e'
import { expectUrl, testCounter } from '../utils'
import { testRun as testRunClassic } from '../../examples/react-minimal/.testRun'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const dir = path.dirname(fileURLToPath(import.meta.url))

let isDev: boolean
function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  isDev = cmd === 'npm run dev'
  testRunClassic(cmd)
  testCumulativeSetting()
  testRouteStringDefinedInConfigFile()
  testSideExports()
  testPrerenderSettings()
  testRedirectMailto()
  testNavigateEarly()
  testDynamicImportFileEnv()
  testNestedLayout()
  testHistoryPushState()
}

function testRouteStringDefinedInConfigFile() {
  test('Route String defined in +config.js', async () => {
    // Route String '/markdown' defined in `+config.js > export default { route }` instead of +route.js
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<h1>Side export .md file</h1>')
  })
}

function testCumulativeSetting() {
  test('Cumulative setting (not serialiazed but imported)', async () => {
    let html: string
    const expectGlobalMetaTags = () => {
      expect(html).toContain('<meta charSet="UTF-8"/>')
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
    }
    const expectAboutMetaTags = () => {
      expect(html).toContain('<meta name="description" content="Playground for testing."/>')
    }

    html = await fetchHtml('/')
    expectGlobalMetaTags()

    html = await fetchHtml('/about')
    expectAboutMetaTags()
    expectGlobalMetaTags()
  })
}

function testSideExports() {
  test('Side export - HTML', async () => {
    const html = await fetchHtml('/markdown')
    // 'Some title' is defined by `export { frontmatter }` of /pages/markdown-page/+Page.md
    expect(html).toContain('<title>Some title set in mdx</title>')
  })

  test('Side export - DOM', async () => {
    await page.goto(getServerUrl() + '/markdown')
    await testCounter()
  })
}

function testPrerenderSettings() {
  if (!isDev) {
    test('pre-render settings', async () => {
      ;[
        ['markdown', true],
        ['pushState', false],
        ['index', false],
        ['about', false]
      ].forEach(([page, exists]) => {
        expect(fs.existsSync(path.join(dir, `./dist/nested/client/${page}.html`))).toBe(exists)
        expect(fs.existsSync(path.join(dir, `./dist/nested/client/${page}/index.pageContext.json`))).toBe(exists)
      })
    })
  }
}

function testRedirectMailto() {
  test('Redirect to URI without http protocol (e.g. `mailto:`)', async () => {
    const resp = await fetch(getServerUrl() + '/mail', { redirect: 'manual' })
    expect(resp.headers.get('Location')).toBe('mailto:some@example.com')
  })
}

function testNavigateEarly() {
  test('Calling navigate() early in +client.js', async () => {
    await page.goto(getServerUrl() + '/navigate-early')
    await autoRetry(
      () => {
        expectUrl('/markdown')
      },
      { timeout: 5000 }
    )
  })
}

function testDynamicImportFileEnv() {
  test('Dyanmic import() of .client.js and .server.js', async () => {
    await page.goto(getServerUrl() + '/dynamic-import-file-env')
    expect(await page.textContent('body')).toContain('Dyanmic import() of .client.js and .server.js')
    expectLog('hello from server', (log) => log.logSource === 'stdout')
    await autoRetry(
      () => {
        expectLog('hello from client', (log) => log.logSource === 'Browser Log')
      },
      { timeout: 5000 }
    )
  })
}

function testNestedLayout() {
  test('Nested layout', async () => {
    await page.goto(getServerUrl() + '/nested-layout/42')
    expect(await page.textContent('h1')).toBe('Nested Layout')
    await testCounter()
    await expectIsScrollUp()
    await scrollDown()
    await expectIsScrollDown()
    await testCounter(1)
    await page.click('a[href="/nested-layout/42/reviews"]')
    await expectIsScrollDown()
    await page.click('a[href="/nested-layout/1337/reviews"]')
    await expectIsScrollUp()
    await scrollDown()
    await page.click('a[href="/nested-layout/1337"]')
    await expectIsScrollDown()
    await testCounter(2)
    await expectIsScrollDown()
  })

  return

  async function scrollDown() {
    await page.evaluate(() => {
      window.document.documentElement.scrollTop = 51
    })
  }
  async function expectIsScrollUp() {
    await expectScroll(0)
  }
  async function expectIsScrollDown() {
    await expectScroll(51)
  }
  async function expectScroll(scroll: number) {
    await autoRetry(
      async () => {
        expect(await getScrollTop()).toBe(scroll)
      },
      { timeout: 5000 }
    )
  }
  async function getScrollTop() {
    const scrollTop = await page.evaluate(() => window.document.documentElement.scrollTop)
    return scrollTop
  }
}

function testHistoryPushState() {
  test('history.pushState()', async () => {
    // Timestamp component works as expected
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await page.click('a[href="/pushState"]')
    const timestamp1 = await getTimestamp()
    await page.click('a[href="/markdown"]')
    await page.click('a[href="/pushState"]')
    const timestamp2 = await getTimestamp()
    expect(timestamp2 > timestamp1).toBe(true)

    // Calling history.pushState() doesn't trigger a re-render, thus timestamp doesn't change
    expectUrl('/pushState')
    {
      const btn = page.locator('button', { hasText: 'Change URL' })
      await btn.click()
    }
    expectUrl('/pushState?query')
    const timestamp3 = await getTimestamp()
    expect(timestamp3).toBe(timestamp2)

    // Navigating back doesn't trigger a re-render, thus timestamp doesn't change
    await page.goBack()
    expectUrl('/pushState')
    const timestamp4 = await getTimestamp()
    expect(timestamp4).toBe(timestamp2)
    await page.goForward()
    expectUrl('/pushState?query')
    const timestamp5 = await getTimestamp()
    expect(timestamp5).toBe(timestamp2)

    // Navigating outside the page does trigger a re-render
    await page.goBack()
    await page.goBack()
    expectUrl('/markdown')
    await page.goForward()
    expectUrl('/pushState')
    await sleep(100)
    const timestamp6 = await getTimestamp()
    expect(timestamp6 > timestamp2).toBe(true)
    await page.goForward()
    expectUrl('/pushState?query')
    const timestamp7 = await getTimestamp()
    expect(timestamp7).toBe(timestamp6)
  })

  return

  async function getTimestamp() {
    let timestampStr: string
    await autoRetry(async () => {
      const val = await page.evaluate(() => document.querySelector('#timestamp')?.textContent)
      expect(val).toBeTruthy()
      timestampStr = val!
    })
    const timestamp = parseInt(timestampStr!, 10)

    // Is a valid timestamp
    expect(timestamp > new Date('2024-01-01').getTime()).toBe(true)
    expect(timestamp < new Date('2050-01-01').getTime()).toBe(true)

    // Ensure subsequent generated timestamps aren't equal
    await sleep(10)

    return timestamp
  }
}
