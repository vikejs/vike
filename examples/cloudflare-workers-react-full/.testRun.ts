export { testRun }

import { page, run, autoRetry, fetchHtml, isGithubAction, urlBase } from '../../libframe/test/setup'

// Node.js 18's fetch implementation fails to resolve `localhost`.
//  - Seems to happen only for wrangler
//  - https://github.com/nodejs/undici/issues/1248
// urlBaseChange('http://127.0.0.1:3000')

function testRun(cmd: 'npm run dev' | 'npm run preview', { hasStarWarsPage }: { hasStarWarsPage: boolean }) {
  const isWrangler = cmd === 'npm run preview'

  if (isWrangler) {
    if (isGithubAction() && process.env['GIT_BRANCH'] !== 'main') {
      // Cloudflare tokens not available in Pull Requests:
      //  - GitHub Actions doesn't make secrets available to Pull Requests.
      //    - https://github.community/t/feature-request-allow-secrets-in-approved-external-pull-requests/18071/4
      const envVars = Object.keys(process.env)
      expect(envVars).not.toContain('CF_ACCOUNT_ID')
      expect(envVars).not.toContain('CF_API_TOKEN')
      const msg = 'SKIPPED: wrangler tests cannot be run in Pull Requests.'
      console.log(msg)
      test(msg, () => {})
      return
    }
  }

  if (isWrangler) {
    const envVars = Object.keys(process.env)
    expect(envVars).toContain('CF_ACCOUNT_ID')
    expect(envVars).toContain('CF_API_TOKEN')
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
