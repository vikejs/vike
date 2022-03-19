import { page, run, autoRetry, fetchHtml, isGithubAction, urlBase } from '../../libframe/test/setup'
import assert from 'assert'

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run preview:miniflare' | 'npm run preview:wrangler',
  { hasStarWarsPage, usesCustomBundler }: { hasStarWarsPage: boolean; usesCustomBundler?: true },
) {
  const isMiniflare = cmd === 'npm run preview:miniflare'
  const isWrangler = cmd === 'npm run preview:wrangler'
  const isWorker = isMiniflare || isWrangler

  if ((isWindows() || isNode12()) && isWorker) {
    const msg = 'SKIPPED: miniflare and wrangler'
    console.log(msg)
    test(msg, () => {})
    return
  }

  if (isWrangler) {
    /* TODO: differentiate between PR VS maintainer branch
    if (isGithubAction() && process.env['GIT_BRANCH'] !== 'master') {
      const msg = 'SKIPPED: wrangler tests are not run in Pull Requests'
      console.log(msg)
      test(msg, () => {})
      return
    }
    */
    const envVars = Object.keys(process.env)
    if (!envVars.includes('CF_ACCOUNT_ID') || !envVars.includes('CF_API_TOKEN')) {
      const msg = 'SKIPPED: No Cloudflare Workers tokens provided.'
      console.log(msg)
      test(msg, () => {})
      return
    }
  }

  {
    const additionalTimeout = !isWorker ? 0 : (isGithubAction() ? 2 : 1) * 120 * 1000
    const serverIsReadyMessage = (() => {
      if (isMiniflare || (isWrangler && usesCustomBundler)) {
        return 'Listening on'
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
