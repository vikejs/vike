import {
  page,
  run,
  autoRetry,
  fetchHtml,
  isGithubAction,
  urlBase,
  urlBaseChange,
  isMac,
} from '../../libframe/test/setup'

// Node.js 18's fetch implementation fails to resolve `localhost`.
//  - Seems to happen only for wrangler
//  - https://github.com/nodejs/undici/issues/1248
urlBaseChange('http://127.0.0.1:3000')

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run preview:miniflare' | 'npm run preview:wrangler',
  { hasStarWarsPage, isWebpack }: { hasStarWarsPage: boolean; isWebpack?: true },
) {
  const isMiniflare = cmd === 'npm run preview:miniflare'
  const isWrangler = cmd === 'npm run preview:wrangler'
  const isWorker = isMiniflare || isWrangler

  // `pnpm exec playwright install` breaks wrangler installation: Miniflare says `You have not installed wrangler`.
  //  - `pnpm install -w @cloudflare/wrangler` doesn't help
  //  - Miniflare cannot use wrangler's webpack bundler
  if (isMiniflare && isWebpack) {
    const msg = 'SKIPPED miniflare + webpack.'
    console.log(msg)
    test(msg, () => {})
    return
  }

  // Skip wrangler until static assets serving is reliable again
  if (isWrangler) {
    const msg = 'SKIPPED wrangler.'
    console.log(msg)
    test(msg, () => {})
    return
  }

  if ((isWindows() || isNode12()) && isWorker) {
    const msg = 'SKIPPED miniflare and wrangler for windows.'
    console.log(msg)
    test(msg, () => {})
    return
  }

  if (isWrangler && isMac()) {
    const msg = 'SKIPPED wrangler for MacOS.'
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
      if (isWrangler && isWebpack) {
        return 'Ignoring stale first change'
      }
      if (isWorker) {
        return 'Listening on'
      }
      // Express.js dev server
      return undefined
    })()
    const serverIsReadyDelay = isWorker ? 5 * 1000 : undefined
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

function isWindows() {
  return process.platform === 'win32'
}
function isNode12() {
  return process.version.startsWith('v12.')
}
