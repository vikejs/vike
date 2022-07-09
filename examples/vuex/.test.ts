import { fetchHtml, run } from '../../libframe/test/setup'

run('npm run dev')

test('page content is rendered to HTML', async () => {
  const html = await fetchHtml('/')
  expect(html).toContain('<h1>To-do List</h1>')
  expect(html).toContain('<li>Buy milk</li><li>Buy chocolate</li>')
  expect(html).toContain('"INITIAL_STATE":{"todoList":[{"id":0,"text":"Buy milk"},{"id":1,"text":"Buy chocolate"}]}')
})
