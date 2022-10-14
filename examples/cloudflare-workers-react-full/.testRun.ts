export { testRun }

import { page, test, expect, run, autoRetry, fetchHtml, isGithubAction, urlBase, skip } from '@brillout/test-e2e'

// Node.js 18's fetch implementation fails to resolve `localhost`.
//  - Seems to happen only for wrangler
//  - https://github.com/nodejs/undici/issues/1248
// urlBaseChange('http://127.0.0.1:3000')

function testRun(cmd: 'npm run dev' | 'npm run preview', { hasStarWarsPage }: { hasStarWarsPage: boolean }) {
  const isWrangler = cmd === 'npm run preview'

  // - `CLOUDFLARE_ACCOUNT_ID`/`CLOUDFLARE_API_TOKEN` not available for:
  //   - Vite's ecosystem CI
  //   - Pull Requests
  //     - https://github.community/t/feature-request-allow-secrets-in-approved-external-pull-requests/18071/4
  if (!process.env['CLOUDFLARE_ACCOUNT_ID']) {
    expect(process.env['CLOUDFLARE_ACCOUNT_ID']).toBeFalsy()
    expect(process.env['CLOUDFLARE_API_TOKEN']).toBeFalsy()
    if (isWrangler) {
      skip(
        "SKIPPED: wrangler tests cannot be run. Because missing environment variables `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. (This is expected in Pull Requests and Vite's ecosystem CI.)"
      )
      return
    }
  } else {
    expect(process.env['CLOUDFLARE_ACCOUNT_ID']).toBeTruthy()
    expect(process.env['CLOUDFLARE_API_TOKEN']).toBeTruthy()
  }

  // Cloudflare Workers seems to be buggy lately
  if (isWrangler) {
    skip('SKIPPED: temporarily skip wrangler tests.)')
    return
  }

  {
    const additionalTimeout = !isWrangler ? 0 : (isGithubAction() ? 2 : 1) * 10 * 1000
    const serverIsReadyMessage = (() => {
      if (isWrangler) {
        return 'Listening at http://localhost:3000'
      }
      // Vite/Express.js dev server
      return undefined
    })()
    run(cmd, { additionalTimeout, serverIsReadyMessage })
  }

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })

  test('about page', async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent('h1')).toBe('About')
  })

  if (hasStarWarsPage) {
    test('data fetching', async () => {
      await page.click('a[href="/star-wars"]')
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('Star Wars Movies')
      })
      const testContent = async () => {
        expect(await page.textContent('body')).toContain('The Phantom Menace')
      }
      try {
        await testContent()
      } catch {
        expect(await page.textContent('body')).toContain('Loading...')
        await autoRetry(testContent)
      }
    })
  }
}
