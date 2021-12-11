import { page, run, autoRetry, fetchHtml, isGithubAction, urlBase } from '../../libframe/test/setup'
import assert from 'assert'

export { runTests }

function runTests(
  cmd: 'npm run dev' | 'npm run prod' | 'npm run dev:miniflare',
  { hasStarWarsPage }: { hasStarWarsPage: boolean },
) {
  const isMiniflare = cmd === 'npm run dev:miniflare'
  const isWrangler = cmd === 'npm run prod'
  const isWorker = isMiniflare || isWrangler

  if ((isWindows() || isNode12()) && isWorker) {
    test('SKIPED: miniflare and wrangler', () => {})
    return
  }

  if (cmd === 'npm run prod') {
    if (!isGithubAction() || process.env['GIT_BRANCH'] !== 'master') {
      test('SKIPED: wrangler test is not run locally nor in Pull Requests', () => {})
      return
    }
    test('API keys', () => {
      const envVars = Object.keys(process.env)
      expect(envVars).toContain('CF_ACCOUNT_ID')
      expect(envVars).toContain('CF_API_TOKEN')
    })
  }

  {
    const additionalTimeout = !isWorker ? 0 : (isGithubAction() ? 2 : 1) * 120 * 1000
    const serverIsReadyMessage = (() => {
      if (isMiniflare) {
        return 'Listening on :3000'
      }
      if (isWrangler) {
        return 'Ignoring stale first change'
      }
      assert(!isWorker)
      // Express.js dev server
      return undefined
    })()
    const serverIsReadyDelay = isWorker ? 5000 : undefined
    run(cmd, { additionalTimeout, serverIsReadyMessage, serverIsReadyDelay })
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
      expect(await page.textContent('body')).toContain('The Phantom Menace')
    })
  }
}

function isWindows() {
  return process.platform === 'win32'
}
function isNode12() {
  return process.version.startsWith('v12.')
}
