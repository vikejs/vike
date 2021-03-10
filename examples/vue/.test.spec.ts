import '../../tests/test.d'

test("page's content should be rendered to HTML", async () => {
  const html = await (await _fetch('http://localhost:3000' + '/')).text()
  expect(html).toContain('<h1>Welcome to <code>vite-plugin-ssr</code></h1>')
  expect(html).toMatch(_partRegExp`<a href="/markdown"${/[^\>]*/}>Markdown</a>`)
  expect(html).toMatch(
    _partRegExp`<a href="/star-wars"${/[^\>]*/}>Data Fetching</a>`
  )
  expect(html).toMatch(
    _partRegExp`<a href="/hello/alice"${/[^\>]*/}>Routing</a>`
  )
})

test('page should be interacive', async () => {
  expect(await _page.textContent('button')).toMatch('0')
  await _page.click('button')
  expect(await _page.textContent('button')).toMatch('1')
})
