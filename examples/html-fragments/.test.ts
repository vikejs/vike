import { run, fetchHtml } from '../../libframe/test/setup'

run('npm run dev')

test('HTML Fragments', async () => {
  const html = await fetchHtml('/')
  expect(html).toContain('<h1>Hello</h1>')
  expect(html).toMatch('<div id="1"><b>I was defined by an HTML Fragment</b></div>')
  expect(html).toMatch('<div id="2">&lt;b&gt;I was defined without an HTML Fragment&lt;/b&gt;</div>')
  expect(html).toMatch('<div>Empty Fragments: 01</div>')
})
