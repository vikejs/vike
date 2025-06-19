export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl, partRegex } from '@brillout/test-e2e'

const text = 'Choose between stable and cutting-edge extensions'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  const isDev = cmd === 'pnpm run dev'

  run(cmd, {
    additionalTimeout: isDev ? undefined : 120 * 1000,
  })

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain(text)
  })

  test('DOM', async () => {
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => !!(window as any)._vike?.fullyRenderedUrl)
    expect(await page.textContent('body')).toContain(text)
  })

  test('favicon', async () => {
    const html = await fetchHtml('/')
    const hash = /[a-zA-Z0-9_-]+/
    const logoUrl: string = isDev
      ? '/assets/logo/vike-favicon.svg'
      : html.match(partRegex`/assets/static/vike-favicon.${hash}.svg`)![0]
    expect(html).toContain(`<link rel="icon" href="${logoUrl}" />`)
    const logoSrc: string = await (await fetch(getServerUrl() + logoUrl)).text()
    expect(logoSrc).toContain('</svg>')
    expect(logoSrc).toContain('<svg')
    expect(logoSrc).toContain('xmlns="http://www.w3.org/2000/svg')
  })
}
