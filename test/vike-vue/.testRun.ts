export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, partRegex } from '@brillout/test-e2e'
// @ts-ignore
import assert from 'node:assert'

let isProd: boolean

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)
  isProd = cmd !== 'pnpm run dev'

  const textLandingPage = 'Rendered to HTML.'
  const title = 'My Vike + Vue App'
  testUrl({
    url: '/',
    title,
    text: textLandingPage,
    counter: true,
  })

  testUrl({
    url: '/star-wars',
    title: '6 Star Wars Movies',
    description: 'All the 6 movies from the Star Wars franchise',
    text: 'A New Hope',
  })

  testUrl({
    url: '/star-wars/3',
    title: 'Return of the Jedi',
    description: 'Star Wars Movie Return of the Jedi from Richard Marquand',
    text: '1983-05-25',
  })

  testUseConfig()

  testConfigComponent()

  testHeadComponent()

  const textNoSSR = 'This page is rendered only in the browser'
  {
    const url = '/without-ssr'
    const text = textNoSSR
    test(url + ' (HTML)', async () => {
      const html = await fetchHtml(url)
      // Isn't rendered to HTML
      expect(html).toContain('<div id="app"></div>')
      expect(html).not.toContain(text)
      expect(getTitle(html)).toBe(title)
    })
    test(url + ' (Hydration)', async () => {
      await page.goto(getServerUrl() + url)
      await testCounter()
      const body = await page.textContent('body')
      expect(body).toContain(text)
    })
    test('Switch between SSR and non-SSR page', async () => {
      let body: string | null
      const t1 = textNoSSR
      const t2 = textLandingPage

      body = await page.textContent('body')
      expect(body).toContain(t1)
      expect(body).not.toContain(t2)
      await ensureWasClientSideRouted('/pages/without-ssr')

      await page.click('a:has-text("Welcome")')
      await testCounter()
      body = await page.textContent('body')
      expect(body).toContain(t2)
      expect(body).not.toContain(t1)
      await ensureWasClientSideRouted('/pages/without-ssr')

      await page.click('a:has-text("Without SSR")')
      await testCounter()
      body = await page.textContent('body')
      expect(body).toContain(t1)
      expect(body).not.toContain(t2)
      await ensureWasClientSideRouted('/pages/without-ssr')
    })
  }

  test('Route Functions - HTML', async () => {
    await page.goto(getServerUrl() + '/hello/alice')
    await expectHelloPage('alice')

    await page.goto(getServerUrl() + '/hello/evan')
    await expectHelloPage('evan')

    await page.goto(getServerUrl() + '/hello')
    await expectHelloPage('anonymous')
  })

  test('Route Functions - DOM', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()

    await page.click('a[href="/hello"]')
    await expectHelloPage('anonymous')

    await page.click('a[href="/hello/eli"]')
    await expectHelloPage('eli')

    await page.click('a[href="/hello/jon"]')
    await expectHelloPage('jon')

    await page.goBack()
    await expectHelloPage('eli')

    await page.goBack()
    await expectHelloPage('anonymous')

    await page.goForward()
    await expectHelloPage('eli')

    await page.goForward()
    await expectHelloPage('jon')
  })
}

function testUrl({
  url,
  title,
  description,
  text,
  counter,
}: { url: string; title: string; description?: string; text: string; counter?: true }) {
  test(url + ' (HTML)', async () => {
    const html = await fetchHtml(url)
    expect(html).toContain(text)
    expect(getTitle(html)).toBe(title)

    if (!description) description = 'Demo showcasing Vike + Vue'
    expect(html).toMatch(partRegex`<meta name="description" content="${description}">`)

    expect(html).toMatch(partRegex`<link rel="icon" href="${getAssetUrl('logo.svg')}">`)
    expect(html).toContain(`<link rel="canonical" href="https://example.com${url}">`)
  })
  test(url + ' (Hydration)', async () => {
    await page.goto(getServerUrl() + url)
    const body = await page.textContent('body')
    expect(body).toContain(text)
    if (counter) {
      await testCounter()
    }
  })
}

function testUseConfig() {
  test('useConfig() HTML', async () => {
    const html = await fetchHtml('/images')
    expect(getTitle(html)).toBe('Image created by Romuald Brillout')
    expect(html).toMatch(
      partRegex`<script type="application/ld+json">{"@context":"https://schema.org/","contentUrl":{"src":"${getAssetUrl(
        'logo-new.svg',
      )}"},"creator":{"@type":"Person","name":"brillout"}}</script>`,
    )
    expect(html).toMatch(
      partRegex`<script type="application/ld+json">{"@context":"https://schema.org/","contentUrl":{"src":"${getAssetUrl(
        'logo.svg',
      )}"},"creator":{"@type":"Person","name":"Romuald Brillout"}}</script>`,
    )
  })
  test('useConfig() hydration', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.title()).toBe('My Vike + Vue App')
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
    await page.click('a:has-text("useConfig()")')
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
    await page.goto(getServerUrl() + '/images')
    expect(await page.title()).toBe('Image created by Romuald Brillout')
    await testCounter()
    await page.goto(getServerUrl() + '/')
    expect(await page.title()).toBe('My Vike + Vue App')
  })
}

function testConfigComponent() {
  test('Config Component HTML', async () => {
    const html = await fetchHtml('/images')
    expect(getTitle(html)).toBe('Image created by Romuald Brillout')
    // check that description is rendered in <head>
    expect(html).toMatch(
      partRegex`<meta name="description" content="Image at address ${getAssetUrl('logo.svg')} was created by Romuald Brillout">${/.*/s}</head>`,
    )
    // check that description is not rendered in <body>
    expect(html).not.toMatch(partRegex`<body>${/.*/s}<meta name="description"`)
    // check that origin description is removed
    expect(html).not.toMatch(partRegex`Demo showcasing Vike + Vue`)
    // check that there is only one description
    expect(countMatches(html, partRegex`<meta${/[^>]+?/}name="description"`)).toBe(1)
  })
}

function testHeadComponent() {
  test('Head Component HTML', async () => {
    const html = await fetchHtml('/images')
    // check that all tags are rendered in <head>
    expect(html).toMatch(partRegex`<meta property="og:image" content="${getAssetUrl('logo-new.svg')}">${/.*/s}</head>`)
    expect(html).toMatch(partRegex`<meta property="og:image" content="${getAssetUrl('logo.svg')}">${/.*/s}</head>`)
    expect(html).toMatch(partRegex`<meta property="og:author" content="brillout">${/.*/s}</head>`)
    expect(html).toMatch(partRegex`<meta property="og:author" content="Romuald Brillout">${/.*/s}</head>`)

    // check that none of the tags is rendered in <body>
    expect(html).not.toMatch(partRegex`<body>${/.*/s}<meta property="og:image"`)
    expect(html).not.toMatch(partRegex`<body>${/.*/s}<meta property="og:author"`)

    // check that there are 2 of each tag
    expect(countMatches(html, partRegex`<meta${/[^>]+?/}property="og:image"`)).toBe(2)
    expect(countMatches(html, partRegex`<meta${/[^>]+?/}property="og:author"`)).toBe(2)
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

/** Ensure page wasn't server-side routed.
 *
 * Examples:
 *   await ensureWasClientSideRouted('/pages/index')
 *   await ensureWasClientSideRouted('/pages/about')
 */
async function ensureWasClientSideRouted(pageIdFirst: `/pages/${string}`) {
  // Check whether the HTML is from the first page before Client-side Routing.
  // page.content() doesn't return the original HTML (it dumps the DOM to HTML).
  // Therefore only the serialized pageContext tell us the original HTML.
  const html = await page.content()
  const pageId = findFirstPageId(html)
  expect(pageId).toBe(pageIdFirst)
}
function findFirstPageId(html: string) {
  expect(html).toContain('<script id="vike_pageContext" type="application/json">')
  expect(html).toContain('"pageId"')
  expect(html.split('"pageId"').length).toBe(2)
  const match = partRegex`"pageId":"${/([^"]+)/}"`.exec(html)
  expect(match).toBeTruthy()
  let pageId = match![1]
  expect(pageId).toBeTruthy()
  pageId =
    // @ts-ignore
    pageId.replaceAll('\\\\/', '/')
  return pageId
}

async function expectHelloPage(name: 'anonymous' | 'jon' | 'alice' | 'evan' | 'eli') {
  await autoRetry(async () => {
    expect(await page.textContent('h1')).toContain('Hello')
    expect(await page.textContent('body')).toContain(`Hi ${name}`)
  })
}

function getAssetUrl(fileName: string) {
  if (!isProd) {
    return `/assets/${fileName}`
  }
  const [fileBaseName, fileExt, ...r] = fileName.split('.')
  assert(r.length === 0)
  return partRegex`/assets/static/${fileBaseName}.${/[a-zA-Z0-9_-]+/}.${fileExt}`
}

function countMatches(haystack: string, needleRe: RegExp) {
  return (haystack.match(new RegExp(needleRe, 'g')) || []).length
}
