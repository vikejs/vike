export { testRun }

import { page, test, expect, getServerUrl, autoRetry, fetch, fetchHtml, sleep } from '@brillout/test-e2e'
import { testRunClassic, sleepBeforeEditFile } from '../../test/utils'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('Running on Express', async () => {
    const html = await fetchHtml('/express')
    expect(html).toContain('Running express server')
  })

  test('+middleware runs once, also for the routes of +server.ts', async () => {
    for (const url of ['/express', '/']) {
      const response = await fetch(`${getServerUrl()}${url}`)
      expect(response.headers.get('x-middleware')).toBe('express')
    }
  })

  test('A +middleware that is a handler answers after the routes of +server.ts, which can override it', async () => {
    expect(await (await fetch(`${getServerUrl()}/handler`)).text()).toBe('from +middleware')
    expect(await (await fetch(`${getServerUrl()}/overridden`)).text()).toBe('from route')
  })

  // pageContext.req/pageContext.res are aliases of pageContext.runtime.req/pageContext.runtime.res — set by +onCreatePageContext.server.ts
  test('pageContext.req/pageContext.res alias pageContext.runtime.req/pageContext.runtime.res', async () => {
    const response = await fetch(`${getServerUrl()}/`)
    expect(response.headers.get('test-pagecontext-req-alias')).toBe('true')
    expect(response.headers.get('test-pagecontext-res-alias')).toBe('true')
  })

  test('Add to-do item', async () => {
    await page.goto(`${getServerUrl()}/todo`)

    // Await hydration
    expect(await page.textContent('button[type="button"]')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button[type="button"]')
      expect(await page.textContent('button[type="button"]')).toContain('Counter 1')
    })

    // Await suspense boundary (for examples/react-streaming)
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('Buy milk')
    })

    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('Buy bananas')
    })
    // avoid race condition of server closing too quickly
    await sleep(100)
  })

  // +server.ts applies `await getUniversalMiddlewares()` itself, which `$ vike dev` re-evaluates when the +middleware change
  if (args[0] === 'pnpm run dev') {
    test('A +middleware file added or removed in dev applies to +server.ts without a restart', async () => {
      // A global config file: another +middleware sits in /pages/
      const dir = fileURLToPath(new URL('./renderer', import.meta.url))
      const status = async () => (await fetch(`${getServerUrl()}/express`)).status
      expect(await status()).toBe(200)
      await sleepBeforeEditFile()
      try {
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(
          `${dir}/+middleware.ts`,
          `import { enhance } from '@universal-middleware/core'
export default enhance(() => new Response('denied', { status: 401 }), {
  name: 'devAddedGuard',
  method: 'GET',
  path: '/express',
  order: -100,
})
`,
        )
        await autoRetry(async () => expect(await status()).toBe(401), { timeout: 10 * 1000 })
      } finally {
        fs.rmSync(dir, { recursive: true, force: true })
      }
      await autoRetry(async () => expect(await status()).toBe(200), { timeout: 10 * 1000 })
    })
  }
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('li').length)
}
