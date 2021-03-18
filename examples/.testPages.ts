import {
  run,
  page,
  urlBase,
  partRegExp,
  fetchHtml,
  autoRetry
} from '../tests/setup'
import assert = require('assert')

export { testPages }
function testPages(
  viewFramework: 'vue' | 'react',
  cmd: 'npm run start' | 'npm run prod'
) {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain('<h1>Welcome to <code>vite-plugin-ssr</code></h1>')
    if (viewFramework === 'vue') {
      expect(html).toMatch(
        partRegExp`<a href="/markdown" data-v-${/[^\>]*/}>Markdown</a>`
      )
      expect(html).toMatch(
        partRegExp`<a href="/star-wars" data-v-${/[^\>]*/}>Data Fetching</a>`
      )
      expect(html).toMatch(
        partRegExp`<a href="/hello/alice" data-v-${/[^\>]*/}>Routing</a>`
      )
    } else {
      expect(html).toContain('<a href="/markdown">Markdown</a>')
      expect(html).toContain('<a href="/star-wars">Data Fetching</a>')
      expect(html).toContain('<a href="/hello/alice">Routing</a>')
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome to vite-plugin-ssr')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('supports route functions', async () => {
    await page.click('a[href="/hello/alice"]')
    expect(await page.textContent('body')).toContain('Hi alice')
    await page.goto(urlBase + '/hello/evan')
    expect(await page.textContent('body')).toContain('Hi evan')
    if (cmd !== 'npm run prod') {
      await page.goto(urlBase + '/hello')
      expect(await page.textContent('body')).toContain('Hi anonymous')
      await page.goto(urlBase + '/hello/')
      expect(await page.textContent('body')).toContain('Hi anonymous')
    }
  })

  test('data fetching page, HTML', async () => {
    const html = await fetchHtml('/star-wars')
    if (viewFramework === 'react') {
      expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
      expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
    }
    if (viewFramework === 'vue') {
      expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
      expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
    }
  })

  test('data fetching page, DOM', async () => {
    await page.click('a[href="/star-wars"]')
    const text = await page.textContent('body')
    expect(text).toContain('Revenge of the Sith')
    expect(text).toContain('The Phantom Menace')

    await page.click('a[href="/star-wars/4"]')
    const pageContent =
      viewFramework === 'vue'
        ? 'The Phantom Menace Release Date: 1999-05-19  Director: George Lucas  Producer: Rick McCallum'
        : 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await page.textContent('body')).toContain(pageContent)
  })

  test('markdown page HTML', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('This page is written in <em>Markdown</em>')
    if (viewFramework === 'react') {
      expect(html).toContain('<button>Counter <!-- -->0</button>')
    } else if (viewFramework === 'vue') {
      expect(html).toMatch(
        partRegExp`<button data-v-${/[^\>]+/}>Counter 0</button>`
      )
    } else {
      assert(false)
    }
  })
  test('markdown page DOM', async () => {
    await page.click('a[href="/markdown"]')
    expect(await page.textContent('body')).toContain(
      'This page is written in Markdown'
    )
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })
}
