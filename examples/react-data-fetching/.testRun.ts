export { testRun }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, sleep } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, testCounter } from '../../test/utils'

function testRun(viewFramework: 'vue' | 'react', cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome to Vike</h1>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Welcome to Vike')
    await testCounter()
    // Client-side routing
    await page.click('a[href="/star-wars"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Star Wars Movies')
    })
    expect(await page.textContent('body')).toContain('The Phantom Menace')
    await ensureWasClientSideRouted('/pages/index')
  })

  test('data fetching page, HTML', async () => {
    const html = await fetchHtml('/star-wars')
    expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
    expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
  })

  test('data fetching page, DOM', async () => {
    await page.goto(getServerUrl() + '/star-wars')
    const text = await page.textContent('body')
    expect(text).toContain('Revenge of the Sith')
    expect(text).toContain('The Phantom Menace')

    if (viewFramework === 'vue') {
      // Attempt to make `examples/vue-full/.dev.test.ts` less flaky: it some times throws a "Hydration Mismatch" error (I don't know why).
      await sleep(1000)
    }
    await page.click('a[href="/star-wars/4"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('The Phantom Menace')
    })
    const pageContent =
      viewFramework === 'vue'
        ? 'The Phantom Menace Release Date: 1999-05-19  Director: George Lucas  Producer: Rick McCallum'
        : 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await page.textContent('body')).toContain(pageContent)
  })
}
