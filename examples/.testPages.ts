import '../tests/test.d'
import assert = require('assert')

const urlBase = 'http://localhost:3000'

export { testPages }

function testPages(viewFramework: 'vue' | 'react') {
  assert(viewFramework === 'vue' || viewFramework === 'react')

  test('page content is rendered to HTML', async () => {
    const html = await (await _fetch('http://localhost:3000' + '/')).text()

    expect(html).toContain('<h1>Welcome to <code>vite-plugin-ssr</code></h1>')
    if (viewFramework === 'vue') {
      expect(html).toMatch(
        _partRegExp`<a href="/markdown" data-v-${/[^\>]*/}>Markdown</a>`
      )
      expect(html).toMatch(
        _partRegExp`<a href="/star-wars" data-v-${/[^\>]*/}>Data Fetching</a>`
      )
      expect(html).toMatch(
        _partRegExp`<a href="/hello/alice" data-v-${/[^\>]*/}>Routing</a>`
      )
    } else {
      expect(html).toContain('<a href="/markdown">Markdown</a>')
      expect(html).toContain('<a href="/star-wars">Data Fetching</a>')
      expect(html).toContain('<a href="/hello/alice">Routing</a>')
    }
  })

  test('page is rendered to the DOM and interacive', async () => {
    await _page.click('a[href="/"]')
    expect(await _page.textContent('h1')).toMatch('Welcome to vite-plugin-ssr')
    expect(await _page.textContent('button')).toMatch('0')
    await _page.click('button')
    expect(await _page.textContent('button')).toMatch('1')
  })

  test('markdown page HTML', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('This page is written in <em>Markdown</em>')
    if (viewFramework === 'react') {
      expect(html).toMatch('<button>Counter <!-- -->0</button>')
    } else if (viewFramework === 'vue') {
      expect(html).toMatch(
        _partRegExp`<button data-v-${/[^\>]*/}>Counter 0</button>`
      )
    } else {
      assert(false)
    }
  })

  test('markdown page DOM', async () => {
    await _page.click('a[href="/markdown"]')
    expect(await _page.textContent('body')).toMatch(
      'This page is written in Markdown'
    )
    expect(await _page.textContent('button')).toMatch('Counter 0')
    await _page.click('button')
    expect(await _page.textContent('button')).toMatch('Counter 1')
  })

  test('data fetcing page, HTML', async () => {
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

  test('data fecthing page, DOM', async () => {
    // DOM
    await _page.click('a[href="/star-wars"]')
    const text = await _page.textContent('body')
    expect(text).toMatch('Revenge of the Sith')
    expect(text).toMatch('The Phantom Menace')

    await _page.click('a[href="/star-wars/4"]')
    const pageContent =
      viewFramework === 'vue'
        ? 'The Phantom Menace Release Date: 1999-05-19  Director: George Lucas  Producer: Rick McCallum'
        : 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await _page.textContent('body')).toContain(pageContent)
  })

  test('supports route functions', async () => {
    await _page.click('a[href="/hello/alice"]')
    expect(await _page.textContent('body')).toContain('Hi alice')
    await _page.goto(urlBase + '/hello')
    expect(await _page.textContent('body')).toContain('Hi anonymous')
    await _page.goto(urlBase + '/hello/blibu')
    expect(await _page.textContent('body')).toContain('Hi blibu')
    await _page.goto(urlBase + '/hello/')
    expect(await _page.textContent('body')).toContain('Hi anonymous')
  })
}

async function fetchHtml(pathname: string) {
  const response = await _fetch(urlBase + pathname)
  const html = await response.text()
  return html
}
