import { autoRetry, expect, expectLog, fetchHtml, getServerUrl, page, run, test } from '@brillout/test-e2e'

export { testRun }

let isProd: boolean

function testRun(
  cmd: `pnpm run ${'dev' | 'preview'}${string}`,
  options: Parameters<typeof run>[1] & { hasServer?: true },
) {
  run(cmd, options)

  isProd = !cmd.startsWith('pnpm run dev')

  test('process.env.NODE_ENV', async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    const bodyText = await page.textContent('body')
    const log = `process.env.NODE_ENV === ${JSON.stringify(isProd ? 'production' : 'development')}`
    if (options.hasServer) expectLog(log, { allLogs: true, filter: (log) => log.logSource === 'stdout' })
    expect(bodyText).toContain(log)
  })

  testUrl({
    url: '/',
    title: 'My Vike App',
    text: isProd ? 'SSR running on Cloudflare' : 'Rendered to HTML',
    textHydration: 'Rendered to HTML',
    counter: true,
  })

  testUrl({
    url: '/star-wars',
    title: '6 Star Wars Movies',
    text: 'A New Hope',
  })

  testUrl({
    url: '/star-wars/3',
    title: 'Return of the Jedi',
    text: '1983-05-25',
  })
}

function testUrl({
  url,
  title,
  text,
  textHydration,
  counter,
  noSSR,
}: {
  url: string
  title: string
  text: string
  textHydration?: string
  counter?: true
  noSSR?: true
}) {
  test(`${url} (HTML)`, async () => {
    const html = await fetchHtml(url)
    if (!noSSR) {
      expect(html).toContain(text)
    }
    expect(getTitle(html)).toBe(title)
  })
  test(`${url} (Hydration)`, async () => {
    await page.goto(getServerUrl() + url)
    if (counter) {
      await testCounter()
    }
    const body = await page.textContent('body')
    expect(body).toContain(textHydration ?? text)
  })
}

function getTitle(html: string) {
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]
  return title
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 },
  )
}
