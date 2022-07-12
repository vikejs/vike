export { testRun }

import { page, run, autoRetry, fetchHtml, urlBase } from '../../libframe/test/setup'
const viteVersion = '3.?.?'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  if (cmd === 'npm run preview' && viteVersion.startsWith('3')) {
    // https://github.com/FormidableLabs/urql/issues/2484
    const msg = 'SKIPPED urql production test until it supports Vite 3.'
    console.log(msg)
    test(msg, () => {})
    return
  }

  test('urql content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Countries</h1>')
    expect(html).toContain('France')
    expect(html).toContain('Germany')
    expect(html).toContain('<h1>Counter</h1>')
    expect(html).toContain('<button>Counter <!-- -->0</button>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })
}
