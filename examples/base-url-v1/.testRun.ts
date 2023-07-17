import { page, test, expect, run, autoRetry, fetchHtml, partRegex, getServerUrl } from '@brillout/test-e2e'
import { ensureWasClientSideRouted } from '../../test/utils'

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run preview' | 'npm run start',
  {
    baseServer,
    baseAssets
  }: { baseServer: '/' | '/some/base-url/'; baseAssets: '/' | '/some/base-url/' | 'http://localhost:8080/cdn/' }
) {
  const addBaseServer = (url: string) => baseServer.slice(0, -1) + url
  const addBaseAssets = (url: string) => baseAssets.slice(0, -1) + url
  const isDev = cmd === 'npm run dev'

  run(cmd)

  test('URLs correctly contain Base URL in HTML', async () => {
    const html = await fetchHtml(addBaseServer('/'))

    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain(`<a href="${addBaseServer('/')}">Home</a>`)
    expect(html).toContain(`<a href="${addBaseServer('/about')}">About</a>`)
    expect(html).toContain(`<link rel="manifest" href="${addBaseAssets('/manifest.json')}">`)
    if (isDev) {
      expect(html).toContain(`<link rel="icon" href="${addBaseAssets('/renderer/logo.svg')}" />`)
    } else {
      expect(html).toMatch(
        partRegex`<link rel="icon" href="${addBaseAssets('/assets/static/logo.')}${/[a-zA-Z0-9]+/}.svg" />`
      )
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + addBaseServer('/'))
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('Client Routing', async () => {
    await page.click(`a[href="${addBaseServer('/about')}"]`)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })
    await ensureWasClientSideRouted('/pages/index')
  })
}
