export { testRun }
import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, partRegex, expectLog } from '@brillout/test-e2e'
import assert from 'node:assert'

let isProd: boolean

const titleDefault = 'My Vike + React App'
const pages = {
  '/': {
    title: titleDefault,
    text: 'Rendered to HTML.',
    counter: true,
    image: true,
  },
  '/star-wars': {
    title: '6 Star Wars Movies',
    description: 'All the 6 movies from the Star Wars franchise',
    text: 'A New Hope',
    image: true,
  },
  '/star-wars/3': {
    title: 'Return of the Jedi',
    description: 'Star Wars Movie Return of the Jedi from Richard Marquand',
    text: '1983-05-25',
  },
  '/streaming': {
    title: titleDefault,
    text: 'Progressive Rendering',
    counter: true,
  },
  '/without-ssr': {
    title: 'No SSR',
    text: 'This page is rendered only in the browser',
    counter: true,
    noSSR: true,
  },
} as const

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)
  isProd = cmd !== 'pnpm run dev'
  testPages()
  testPageNavigation_betweenWithSSRAndWithout()
  testPageNavigation_titleUpdate()
  testUseConfig()
  testReactSetting()
}

function testPageNavigation_betweenWithSSRAndWithout() {
  const textWithSSR = 'Rendered to HTML.'
  const textWithoutSSR = "It isn't rendered to HTML"

  const url = '/without-ssr'
  test(url + " isn't rendered to HTML", async () => {
    const html = await fetchHtml(url)
    expect(html).toContain('<div id="root"></div>')
    expect(html).not.toContain(textWithoutSSR)
    await page.goto(getServerUrl() + url)
    await testCounter()
    const body = await page.textContent('body')
    expect(body).toContain(textWithoutSSR)
  })

  test('Switch between SSR and non-SSR page', async () => {
    let body: string | null
    const t1 = textWithoutSSR
    const t2 = textWithSSR

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

function testPageNavigation_titleUpdate() {
  test('title update client-side page navigation', async () => {
    {
      const { title } = pages['/']
      await page.goto(getServerUrl() + '/')
      await expectTitle(title)
    }
    const testMovieList = async () => {
      const { title } = pages['/star-wars']
      await page.click(`a[href="/star-wars"]`)
      await expectTitle(title)
    }
    await testMovieList()
    const testMoviePage = async () => {
      const { title } = pages['/star-wars/3']
      await page.click(`a:has-text("${title}")`)
      await expectTitle(title)
    }
    await testMoviePage()
    await testMovieList()
    await testMoviePage()
    await testMovieList()
    await testMoviePage()
  })
}
async function expectTitle(title: string) {
  await autoRetry(async () => {
    const titleActual = await page.evaluate(() => window.document.title)
    expect(titleActual).toBe(title)
  })
}

function testPages() {
  Object.entries(pages).forEach(([url, pageInfo]) => {
    testPage({ url, ...pageInfo })
  })
}

function testPage({
  url,
  title,
  description,
  text,
  counter,
  noSSR,
  image,
}: {
  url: string
  title: string
  description?: string
  text: string
  counter?: true
  noSSR?: true
  image?: true
}) {
  test(url + ' (HTML)', async () => {
    const html = await fetchHtml(url)
    if (!noSSR) {
      expect(html).toContain(text)
    }
    expect(getTitle(html)).toBe(title)
    expect(html).toMatch(partRegex`<link rel="icon" href="${getAssetUrl('logo.svg')}"/>`)

    if (description) {
      expect(html).toMatch(partRegex`<meta name="description" content="${description}"${/\s*/}/>`)
    } else {
      expect(html).not.toContain('<meta name="description"')
    }

    if (image) {
      expect(html).toMatch(partRegex`<meta property="og:image" content="${getAssetUrl('logo-new.svg')}">`)
    } else {
      expect(html).not.toContain('og:image')
    }
  })
  test(url + ' (Hydration)', async () => {
    await page.goto(getServerUrl() + url)
    if (counter) {
      await testCounter()
    }
    const body = await page.textContent('body')
    expect(body).toContain(text)
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

function testUseConfig() {
  test('useConfig() HTML', async () => {
    const html = await fetchHtml('/images')
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
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
    await page.click('a:has-text("useConfig()")')
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
    await page.goto(getServerUrl() + '/images')
    await testCounter()
  })
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
  pageId = pageId.replaceAll('\\\\/', '/')
  return pageId
}

function getAssetUrl(fileName: string) {
  if (!isProd) {
    return `/assets/${fileName}`
  }
  const [fileBaseName, fileExt, ...r] = fileName.split('.')
  assert(r.length === 0)
  return partRegex`/assets/static/${fileBaseName}.${/[a-zA-Z0-9_-]+/}.${fileExt}`
}

function testReactSetting() {
  test('+react.{server.client}.js', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    expectLog('some-id-server-prefix', { filter: (log) => log.logSource === 'stdout' })
    expectLog('some-id-client-prefix', { filter: (log) => log.logSource === 'Browser Log' })
  })
}
