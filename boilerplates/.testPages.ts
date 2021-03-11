import '../tests/test.d'
import assert = require('assert')

const urlBase = 'http://localhost:3000'

export { testPages }

function testPages(viewFramework: 'vue' | 'react') {
  assert(viewFramework === 'vue' || viewFramework === 'react')

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain('<h1>Welcome</h1>')
    if (viewFramework === 'vue') {
      expect(html).toMatch(_partRegExp`<a href="/" data-v-${/[^\>]*/}>Home</a>`)
      expect(html).toMatch(
        _partRegExp`<a href="/about" data-v-${/[^\>]*/}>About</a>`
      )
    } else {
      expect(html).toContain('<a href="/">Home</a>')
      expect(html).toContain('<a href="/about">About</a>')
    }
  })

  test('page is rendered to the DOM and interacive', async () => {
    await _page.click('a[href="/"]')
    expect(await _page.textContent('h1')).toBe('Welcome')
    expect(await _page.textContent('button')).toBe('Counter 0')
    await _page.click('button')
    expect(await _page.textContent('button')).toBe('Counter 1')
  })

  test('about page', async () => {
    await _page.click('a[href="/about"]')
    expect(await _page.textContent('h1')).toBe('About')
    // CSS is loaded only after being dynamically `import()`'d from JS
    await _sleep(500)
    expect(await _page.$eval('p', (e) => getComputedStyle(e).color)).toBe(
      'rgb(0, 128, 0)'
    )
  })
}

async function fetchHtml(pathname: string) {
  const response = await _fetch(urlBase + pathname)
  const html = await response.text()
  return html
}
